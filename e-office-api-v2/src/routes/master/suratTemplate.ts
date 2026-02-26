import { authGuardPlugin, requirePermission } from "@backend/middlewares/auth.ts";
import { Elysia, t } from "elysia";
import { Prisma } from "@backend/db/index.ts";
import { LetterTemplateService } from "@backend/services/database_models/letterTemplate.service.ts";

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/all",
		async ({ query }) => {
			const page = Number(query.page ?? 1);
			const take = Number(query.take ?? 0);
			const shouldPaginate = Number.isFinite(take) && take > 0;
			const search = query.search?.trim();
			const category = query.category?.trim();

			const where: Record<string, unknown> = {};

			if (search) {
				where.versionName = { contains: search, mode: "insensitive" };
			}
			if (category) {
				where.LetterType = {
					name: { equals: category },
				};
			}

			if (!shouldPaginate) {
				return LetterTemplateService.getMany({
					where,
					include: { LetterType: true },
					orderBy: { versionName: "asc" },
				});
			}

			const [items, total] = await Prisma.$transaction([
				Prisma.letterTemplate.findMany({
					where,
					include: { LetterType: true },
					orderBy: { versionName: "asc" },
					skip: (page - 1) * take,
					take,
				}),
				Prisma.letterTemplate.count({ where }),
			]);

			return {
				items,
				total,
				page,
				pageSize: take,
			};
		},
		{
			...requirePermission("letterTemplate", "read"),
			body: t.Object({}),
			query: t.Object({
				page: t.Optional(t.Numeric()),
				take: t.Optional(t.Numeric()),
				search: t.Optional(t.String()),
				category: t.Optional(t.String()),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id } }) => {
			return LetterTemplateService.get(id);
		},
		{
			...requirePermission("letterTemplate", "read"),
			body: t.Object({}),
		},
	)
	.post(
		"/",
		async ({
			body: { schemaDefinition, formFields, letterTypeId, versionName },
		}) => {
			const letter = await LetterTemplateService.create({
				schemaDefinition,
				formFields,
				letterTypeId,
				versionName,
			});

			return {
				message: "Letter Template created successfully",
				letter,
			};
		},
		{
			...requirePermission("letterTemplate", "create"),
			body: t.Object({
				schemaDefinition: t.Any(),
				formFields: t.Any(),
				letterTypeId: t.String(),
				versionName: t.String(),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ params: { id }, body: { schemaDefinition, formFields, versionName } }) => {
			const letter = await LetterTemplateService.update(id, {
				schemaDefinition,
				formFields,
				versionName,
			});

			return {
				message: "Letter Template updated successfully",
				letter,
			};
		},
		{
			...requirePermission("letterTemplate", "update"),
			body: t.Object({
				schemaDefinition: t.Any(),
				formFields: t.Any(),
				versionName: t.Optional(t.String()),
			}),
		},
	);
