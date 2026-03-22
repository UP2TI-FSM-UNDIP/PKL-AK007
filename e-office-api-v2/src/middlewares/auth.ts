import { Elysia } from "elysia";
import { auth } from "@backend/lib/auth";
import { Prisma } from "@backend/db/index";
import { checkPermission, getUserRoles } from "@backend/lib/casbin";

export interface PermissionProps {
	resource: string;
	action: string;
}

export interface RequiredRoleProps {
	requiredRole: string;
}

/* ---------- authGuardPlugin ---------- */
export const authGuardPlugin = new Elysia({
	name: "auth",
})
	.resolve(async ({ status, request: { headers } }) => {
		const cookie = headers.get("cookie");
		const host = headers.get("host");
		const forwardedHost = headers.get("x-forwarded-host");
		console.log(`[AuthGuard] Cookie: ${cookie?.substring(0, 30)}... | Host: ${host} | F-Host: ${forwardedHost}`);
		
		const session = await auth.api.getSession({ headers });
		console.log("[AuthGuard] Session found:", !!session);

		if (!session) {
			console.log("[AuthGuard] Unauthorized access to scoped route");
			return status(401);
		}
		const currentUser = await Prisma.user.findUnique({
			where: { id: session.user.id },
			select: { deletedAt: true },
		});
		if (currentUser?.deletedAt) {
			return status(403, {
				error: "Forbidden",
				message: "Akun telah dinonaktifkan oleh admin",
			});
		}

		return {
			user: session.user,
			session: session.session,
		};
	})
	.macro({
		permission: ({ resource, action }: PermissionProps) => {
			return {
				async resolve({ status, user }) {
					if (!user) {
						return status(401, {
							error: "Unauthorized",
							message: "Authentication required",
						});
					}

					const hasPermission = await checkPermission(
						user.id,
						resource,
						action,
					);

					if (!hasPermission) {
						const roles = await getUserRoles(user.id);
						return status(403, {
							error: "Forbidden",
							message: `You don't have permission to ${action} ${resource}`,
							userRoles: roles,
						});
					}

					return { user };
				},
			};
		},

		role: ({ requiredRole }: RequiredRoleProps) => {
			return {
				async resolve({ status, user }) {
					if (!user) {
						return status(401, {
							error: "Unauthorized",
							message: "Authentication required",
						});
					}

					const roles = await getUserRoles(user.id);
					const normalizedRoles = roles.map((role) => role.toLowerCase());
					const normalizedRequired = requiredRole.toLowerCase();

					if (!normalizedRoles.includes(normalizedRequired)) {
						return status(403, {
							error: "Forbidden",
							message: `Role '${requiredRole}' required`,
							userRoles: roles,
						});
					}
					return { user };
				},
			};
		},
	})
	.as("scoped");

/* ---------- helper functions ---------- */
export const requirePermission = (resource: string, action: string) => ({
	permission: { resource, action },
});

export const requireRole = (role: string) => ({
	role: { requiredRole: role },
});
