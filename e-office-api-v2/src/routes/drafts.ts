import { authGuardPlugin } from "@backend/middlewares/auth";
import { Prisma } from "@backend/db/index";
import { Elysia, t } from "elysia";

const draftDataSchema = t.Object({
	namaLengkap: t.Optional(t.String()),
	role: t.Optional(t.String()),
	nim: t.Optional(t.String()),
	email: t.Optional(t.String()),
	departemen: t.Optional(t.String()),
	programStudi: t.Optional(t.String()),
	tempatLahir: t.Optional(t.String()),
	tanggalLahir: t.Optional(t.String()),
	noHp: t.Optional(t.String()),
	alamat: t.Optional(t.String()),
	jenisSurat: t.Optional(t.String()),
	keperluan: t.Optional(t.String()),
	attachments: t.Optional(
		t.Array(
			t.Object({
				id: t.String(),
				name: t.String(),
				url: t.String(),
				type: t.Optional(t.String()),
				typeLabel: t.Optional(t.String()),
				isMain: t.Optional(t.Boolean()),
				size: t.Optional(t.String()),
				fileSize: t.Optional(t.Number()),
			}),
		),
	),
});

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/",
		async ({ user, query }) => {
			const page = Number(query.page ?? 1);
			const take = Number(query.take ?? 0);
			const shouldPaginate = Number.isFinite(take) && take > 0;
			const search = query.search?.trim();

			const where: Record<string, unknown> = { userId: user.id };

			if (search) {
				where.OR = [
					{ title: { contains: search, mode: "insensitive" } },
					{
						data: {
							path: ["keperluan"],
							string_contains: search,
						},
					},
				];
			}

			if (!shouldPaginate) {
				return Prisma.letterDraft.findMany({
					where,
					orderBy: { updatedAt: "desc" },
				});
			}

			const [items, total] = await Prisma.$transaction([
				Prisma.letterDraft.findMany({
					where,
					orderBy: { updatedAt: "desc" },
					skip: (page - 1) * take,
					take,
				}),
				Prisma.letterDraft.count({ where }),
			]);

			return {
				items,
				total,
				page,
				pageSize: take,
			};
		},
		{
			query: t.Object({
				page: t.Optional(t.Numeric()),
				take: t.Optional(t.Numeric()),
				search: t.Optional(t.String()),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, user, status }) => {
			const draft = await Prisma.letterDraft.findFirst({
				where: { id, userId: user.id },
			});

			if (!draft) {
				return status(404);
			}

			return draft;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
		},
	)
	.post(
		"/",
		async ({ body, user }) => {
			return Prisma.letterDraft.create({
				data: {
					title: body.title,
					letterTypeId: body.letterTypeId,
					data: body.data,
					userId: user.id,
				},
			});
		},
		{
			body: t.Object({
				title: t.Optional(t.String()),
				letterTypeId: t.Optional(t.String()),
				data: draftDataSchema,
			}),
		},
	)
	.patch(
		"/:id",
		async ({ params: { id }, body, user, status }) => {
			const draft = await Prisma.letterDraft.findFirst({
				where: { id, userId: user.id },
			});

			if (!draft) {
				return status(404);
			}

			const updateData: {
				title?: string;
				letterTypeId?: string;
				data?: Record<string, unknown>;
			} = {};

			if (typeof body.title !== "undefined") updateData.title = body.title;
			if (typeof body.letterTypeId !== "undefined") {
				updateData.letterTypeId = body.letterTypeId;
			}
			if (typeof body.data !== "undefined") {
				const currentData =
					draft.data && typeof draft.data === "object"
						? (draft.data as Record<string, unknown>)
						: {};
				updateData.data = { ...currentData, ...body.data };
			}

			return Prisma.letterDraft.update({
				where: { id },
				data: updateData,
			});
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				title: t.Optional(t.String()),
				letterTypeId: t.Optional(t.String()),
				data: t.Optional(draftDataSchema),
			}),
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, user, status }) => {
			const draft = await Prisma.letterDraft.findFirst({
				where: { id, userId: user.id },
			});

			if (!draft) {
				return status(404);
			}

			return Prisma.letterDraft.delete({
				where: { id },
			});
		},
		{
			params: t.Object({
				id: t.String(),
			}),
		},
	);
