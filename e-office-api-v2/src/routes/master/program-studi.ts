import { authGuardPlugin, requirePermission } from "@backend/middlewares/auth";
import { ProgramStudiService } from "@backend/services/database_models/programStudi.service";
import { Elysia, t } from "elysia";

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/all",
		async () => {
			return ProgramStudiService.getAll();
		},
		{
			body: t.Object({}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id } }) => {
			return ProgramStudiService.get(id);
		},
		{
			...requirePermission("prodi", "read"),
			body: t.Object({}),
		},
	);
