import { auth } from "@backend/lib/auth.ts";
import { PrismaClient } from "@backend/db/index.ts";
import { Elysia, t } from "elysia";
import { setSessionCookie } from "better-auth/cookies";
import { APIError } from "better-auth";

const prisma = new PrismaClient();

export default new Elysia()
    /**
     * SSO Callback Entry (Hit by SSO Portal Server-Side)
     * Step 1 in guide: Portal hits this, we return the path for the browser redirect.
     */
    .get("/", async ({ headers }) => {
        const authHeader = headers.authorization;
        console.log("[SSO Portal Hit] authHeader:", authHeader?.substring(0, 20) + "...");

        if (!authHeader) {
            return { status: false, message: "No Authorization header" };
        }

        // We return the path RELATIVE to the application's base URL.
        // The portal will prepend "persuratan-keterangan-mhs/" automatically.
        // We include the trailing slash as per Next.js config (trailingSlash: true).
        const callbackUrl = `/auth/sso/bridge/?token=${encodeURIComponent(authHeader)}`;
        console.log("[SSO Portal Hit] Returning relative callback_url:", callbackUrl);

        return {
            status: true,
            callback_url: callbackUrl
        };
    });
