// dont use any @ import for this file, better auth is picky
import { PrismaClient } from "@backend/db/index";
import { betterAuth, APIError } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { anonymous, bearer } from "better-auth/plugins";
import { createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import * as z from "zod";
import type { BetterAuthPlugin } from "better-auth";

const prisma = new PrismaClient();

const ssoPlugin = {
	id: "sso-plugin",
	endpoints: {
		ssoCallback: createAuthEndpoint(
			"/sso/callback",
			{
				method: "GET",
				query: z.object({
					token: z.string(),
				}),
			},
			async (ctx) => {
				const token = ctx.query.token;
				const validateUrl = process.env.SSO_VALIDATE_URL || "https://apps-fsm.undip.ac.id/sso_api/users/validate";
				
				const response = await fetch(validateUrl, {
					headers: {
						Authorization: token,
					},
				});

				if (!response.ok) {
					throw new APIError("UNAUTHORIZED", { message: "Invalid SSO token" });
				}

				const ssoValidation = (await response.json()) as any;
				const ssoUser = ssoValidation.data?.user;
				const email = ssoUser?.username || ssoUser?.email;

				if (!email) {
					console.error("[SSO Plugin] Missing email in SSO response:", ssoValidation);
					throw new APIError("BAD_REQUEST", { message: "SSO user missing email" });
				}

				// Find or create user
				const existingUser = await ctx.context.internalAdapter.findUserByEmail(email);
				let userToSession: any;

				if (!existingUser) {
					// Create new base user
					const newUser = await ctx.context.internalAdapter.createUser({
						email,
						name: ssoUser.name || email,
						emailVerified: true,
					});
					userToSession = newUser;

					// SYNC ROLES AND PROFILES (Mahasiswa/Superadmin)
					const role = ssoUser.role; // "mahasiswa", "superadmin"

					if (role === "mahasiswa") {
						await prisma.mahasiswa.create({
							data: {
								userId: newUser.id,
								nim: "", // Left empty for onboarding modal
								tahunMasuk: "",
								noHp: "",
							},
						});
						const roleEntry = await prisma.role.findFirst({ where: { name: "mahasiswa" } });
						if (roleEntry) {
							await prisma.userRole.create({
								data: {
									userId: newUser.id,
									roleId: roleEntry.id,
								},
							});
						}
					} else if (role === "superadmin") {
						const roleEntry = await prisma.role.findFirst({ where: { name: "superadmin" } });
						if (roleEntry) {
							await prisma.userRole.create({
								data: {
									userId: newUser.id,
									roleId: roleEntry.id,
								},
							});
						}
					}
				} else {
					userToSession = existingUser.user;
				}

				if (!userToSession) {
					throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to resolve user" });
				}

				// Create Session using Better Auth internal methods
				const session = await ctx.context.internalAdapter.createSession(userToSession.id, false);
				if (!session) {
					throw new APIError("INTERNAL_SERVER_ERROR", { message: "Failed to create session" });
				}

				// This sets a SIGNED cookie on the response
				await setSessionCookie(ctx, {
					session,
					user: userToSession,
				});

				// Redirect the browser to our root dashboard.
				// This is hit by the User's browser via the Next.js Bridge.
				const dashboardUrl = `${process.env.EXTERNAL_FE_URL || "https://apps-fsm.undip.ac.id/persuratan-keterangan-mhs"}/`;
				
				return new Response(null, {
					status: 302,
					headers: {
						Location: dashboardUrl,
					},
				});
			}
		),
	},
} satisfies BetterAuthPlugin;

export const auth = betterAuth({
	baseURL: process.env.AUTH_BASE_URL || "https://apps-fsm.undip.ac.id",
	trustedOrigins: [
		process.env.AUTH_TRUSTED_ORIGIN || "http://localhost:3001",
		"http://localhost:3000",
		"http://10.137.58.124:20031",
		"https://apps-fsm.undip.ac.id"
	],
	trustedProxyHeaders: true,
	advanced: {
		useSecureCookies: true,
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	experimental: {
		joins: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	emailAndPassword: {
		enabled: true,
	},
	basePath: "/api/auth",
	plugins: [
		anonymous(),
		bearer(),
		ssoPlugin,
	],
});
