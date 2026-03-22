import { cors } from "@elysiajs/cors";
import { serverTiming } from "@elysiajs/server-timing";
import { swagger } from "@elysiajs/swagger";
import { auth } from "@backend/lib/auth";
import { Elysia } from "elysia";
import { autoload } from "elysia-autoload";
import env from "env-var";


export const app = new Elysia()
	.onRequest((ctx) => {
		console.log(`[Elysia] INCOMING: ${ctx.request.method} ${ctx.request.url}`);
	})
	.onError(({ code, error, request }) => {
		console.log(`[Elysia] ERROR ${code}: ${request.method} ${request.url} - ${error instanceof Error ? error.message : "Unknown error"}`);
	})
	.use(swagger())
	.use(
		cors({
			origin: [
    "http://10.137.58.124:20031",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://apps-fsm.undip.ac.id",
  ],
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.all("/api/auth", ({ request }) => auth.handler(request))
	.all("/api/auth/*", ({ request }) => auth.handler(request))
	.use(serverTiming())
	.use(
		await autoload({
			types: {
				output: "./autogen.routes",
				typeName: "App",
				useExport: true,
			},
		}),
	)

export type App = typeof app;
