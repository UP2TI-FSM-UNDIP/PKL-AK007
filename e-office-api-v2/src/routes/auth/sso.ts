import { auth } from "@backend/lib/auth";
import { PrismaClient } from "@backend/db/index";
import { Elysia, t } from "elysia";
import { setSessionCookie } from "better-auth/cookies";
import { APIError } from "better-auth";

const prisma = new PrismaClient();

export default new Elysia()
    .get("/", async ({ headers, set }) => {
        const authHeader = headers.authorization;
        console.log("[SSO Portal Hit] authHeader:", authHeader?.substring(0, 20) + "...");

        if (!authHeader) {
            set.status = 401;
            return { status: false, message: "No Authorization header" };
        }

        const validateUrl = process.env.SSO_VALIDATE_URL || "https://apps-fsm.undip.ac.id/sso_api/users/validate";
        try {
            const validateRes = await fetch(validateUrl, {
                headers: { Authorization: authHeader },
            });

            if (!validateRes.ok) {
                set.status = 401;
                return { status: false, message: "Invalid SSO token" };
            }
        } catch (err) {
            console.error("[SSO Portal Hit] Validation error:", err);
            set.status = 401;
            return { status: false, message: "Invalid SSO token" };
        }

        const callbackUrl = `/auth/sso/bridge/?token=${encodeURIComponent(authHeader)}`;
        console.log("[SSO Portal Hit] Token valid. Returning callback_url:", callbackUrl);

        return {
            status: true,
            callback_url: callbackUrl
        };
    });
