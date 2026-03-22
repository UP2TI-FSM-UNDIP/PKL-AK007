import { authGuardPlugin } from "@backend/middlewares/auth";
import { Elysia } from "elysia";

export default new Elysia().use(authGuardPlugin).get(
	"/",
	async ({ user }) => {
		console.log(user);
		return user;
	},
	{},
);
