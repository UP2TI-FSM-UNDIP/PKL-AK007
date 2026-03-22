import { authGuardPlugin, requireRole } from "@backend/middlewares/auth";
import { Prisma } from "@backend/db/index";
import { Elysia, t } from "elysia";

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/",
		async ({ query, user }) => {
			const scope = query.scope;
			const page = Number(query.page ?? 1);
			const take = Number(query.take ?? 0);
			const shouldPaginate = Number.isFinite(take) && take > 0;
			const search = query.search?.trim();
			const statusList = query.status
				? query.status.split(",").map((item) => item.trim()).filter(Boolean)
				: [];

			const where: Record<string, unknown> =
				scope === "all"
					? {}
					: {
							createdById: user.id,
						};

			if (statusList.length) {
				where.status = { in: statusList };
			}

			if (query.startDate || query.endDate) {
				where.createdAt = {
					...(query.startDate ? { gte: new Date(query.startDate) } : {}),
					...(query.endDate ? { lte: new Date(query.endDate) } : {}),
				};
			}

			if (search) {
				where.OR = [
					{
						letterType: {
							name: { contains: search, mode: "insensitive" },
						},
					},
					{
						createdBy: {
							name: { contains: search, mode: "insensitive" },
						},
					},
					{
						values: {
							path: ["keperluan"],
							string_contains: search,
						},
					},
				];
			}

			if (!shouldPaginate) {
				return Prisma.letterInstance.findMany({
					where,
					orderBy: { createdAt: "desc" },
					include: {
						letterType: true,
						createdBy: true,
					},
				});
			}

			const [items, total] = await Prisma.$transaction([
				Prisma.letterInstance.findMany({
					where,
					orderBy: { createdAt: "desc" },
					include: {
						letterType: true,
						createdBy: true,
					},
					skip: (page - 1) * take,
					take,
				}),
				Prisma.letterInstance.count({ where }),
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
				scope: t.Optional(t.String()),
				page: t.Optional(t.Numeric()),
				take: t.Optional(t.Numeric()),
				search: t.Optional(t.String()),
				status: t.Optional(t.String()),
				startDate: t.Optional(t.String()),
				endDate: t.Optional(t.String()),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, query, user, status }) => {
			const scope = query.scope;
			const where =
				scope === "all"
					? { id }
					: {
							id,
							createdById: user.id,
						};

			const letter = await Prisma.letterInstance.findFirst({
				where,
				include: {
					letterType: true,
					createdBy: {
						include: {
							mahasiswa: true,
							pegawai: true,
							userRole: {
								include: {
									role: true,
								},
							},
						},
					},
				},
			});

			if (!letter) {
				return status(404);
			}

			return letter;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			query: t.Object({
				scope: t.Optional(t.String()),
			}),
		},
	)
	.get(
		"/:id/history",
		async ({ params: { id }, query, user, status }) => {
			const scope = query.scope;
			const merge =
				query.merge === "1" ||
				query.merge === "true" ||
				query.merge === "yes";
			const where =
				scope === "all"
					? { id }
					: {
							id,
							createdById: user.id,
						};

			const letter = await Prisma.letterInstance.findFirst({
				where,
			});

			if (!letter) {
				return status(404);
			}

			const history = await Prisma.letterHistory.findMany({
				where: { letterInstanceId: letter.id },
				orderBy: { createdAt: "asc" },
				include: {
					actor: true,
				},
			});

			if (!merge) {
				return history;
			}

			const hasRevisionNote = history.some(
				(item) =>
					item.note &&
					item.note.toLowerCase().includes("proses revisi"),
			);

			const readValue = (
				values: Record<string, unknown> | null | undefined,
				key: string,
			) => {
				const value = values?.[key];
				return typeof value === "string" ? value.trim() : "";
			};

			const currentValues =
				letter.values && typeof letter.values === "object"
					? (letter.values as Record<string, unknown>)
					: null;

			const previous = await Prisma.letterInstance.findFirst({
				where: {
					createdById: letter.createdById,
					letterTypeId: letter.letterTypeId,
					status: "IN_PROGRESS",
					id: { not: letter.id },
					createdAt: { lt: letter.createdAt },
				},
				orderBy: { createdAt: "desc" },
			});

			if (!previous) {
				return history;
			}

			const previousValues =
				previous.values && typeof previous.values === "object"
					? (previous.values as Record<string, unknown>)
					: null;

			const matchesValues =
				readValue(previousValues, "keperluan") !== "" &&
				readValue(previousValues, "keperluan") ===
					readValue(currentValues, "keperluan") &&
				readValue(previousValues, "jenisSurat") ===
					readValue(currentValues, "jenisSurat");

			if (!hasRevisionNote && !matchesValues) {
				return history;
			}

			const previousHistory = await Prisma.letterHistory.findMany({
				where: { letterInstanceId: previous.id },
				orderBy: { createdAt: "asc" },
				include: {
					actor: true,
				},
			});

			return [...previousHistory, ...history].sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
			);
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			query: t.Object({
				scope: t.Optional(t.String()),
				merge: t.Optional(t.String()),
			}),
		},
	)
	.post(
		"/",
		async ({ body, user, status }) => {
			const draft = await Prisma.letterDraft.findFirst({
				where: { id: body.draftId, userId: user.id },
			});

			if (!draft) {
				return status(404);
			}

			const fallbackType = await Prisma.letterType.findFirst({
				orderBy: { createdAt: "desc" },
			});

			const inferredTypeName =
				typeof draft.data === "object" && draft.data && "jenisSurat" in draft.data
					? String((draft.data as Record<string, unknown>).jenisSurat)
					: "AK 007";

			const letterTypeId =
				body.letterTypeId ??
				draft.letterTypeId ??
				fallbackType?.id ??
				(
					await Prisma.letterType.create({
						data: {
							name: inferredTypeName,
						},
					})
				).id;

			if (!letterTypeId) {
				return status(400, { error: "LETTER_TYPE_REQUIRED" });
			}

			const template = await Prisma.letterTemplate.findFirst({
				where: { letterTypeId },
				orderBy: { id: "desc" },
			});

			const schema = template?.schemaDefinition ?? {};
			const values =
				draft.data && typeof draft.data === "object" ? draft.data : {};

			const letter = await Prisma.$transaction(async (tx) => {
				const created = await tx.letterInstance.create({
					data: {
						schema,
						values,
						status: "PENDING",
						letterTypeId,
						createdById: user.id,
					},
				});

				await tx.letterHistory.create({
					data: {
						letterInstanceId: created.id,
						actorId: user.id,
						status: "PENDING",
						note: "Submitted",
					},
				});

				await tx.letterDraft.delete({
					where: { id: draft.id },
				});

				return created;
			});

			return letter;
		},
		{
			body: t.Object({
				draftId: t.String(),
				letterTypeId: t.Optional(t.String()),
			}),
		},
	)
	.post(
		"/:id/actions/supervisor",
		async ({ params: { id }, body, user, status }) => {
			const letter = await Prisma.letterInstance.findFirst({
				where: { id },
			});

			if (!letter) {
				return status(404);
			}

			if (letter.status !== "PENDING" && letter.status !== "IN_PROGRESS") {
				return status(409, { error: "INVALID_STATUS" });
			}

			const nextStatus =
				body.action === "APPROVE"
					? "COMPLETED"
					: body.action === "REVISE"
					? "IN_PROGRESS"
					: "REJECTED";

			const fallbackNote =
				body.action === "APPROVE"
					? "Disetujui oleh Supervisor Akademik"
					: body.action === "REVISE"
					? "Revisi oleh Supervisor Akademik"
					: "Ditolak oleh Supervisor Akademik";

			const [history] = await Prisma.$transaction([
				Prisma.letterHistory.create({
					data: {
						letterInstanceId: letter.id,
						actorId: user.id,
						status: nextStatus,
						note: body.note ?? fallbackNote,
					},
				}),
				Prisma.letterInstance.update({
					where: { id: letter.id },
					data: { status: nextStatus },
				}),
			]);

			return history;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				action: t.Union([
					t.Literal("APPROVE"),
					t.Literal("REVISE"),
					t.Literal("REJECT"),
				]),
				note: t.Optional(t.String()),
			}),
			...requireRole("supervisor_akademik"),
		},
	)
	.post(
		"/:id/actions/manager",
		async ({ params: { id }, body, user, status }) => {
			const letter = await Prisma.letterInstance.findFirst({
				where: { id },
			});

			if (!letter) {
				return status(404);
			}

			if (letter.status !== "COMPLETED" && letter.status !== "IN_PROGRESS") {
				return status(409, { error: "INVALID_STATUS" });
			}

			const nextStatus =
				body.action === "APPROVE"
					? "UPA_REVIEW"
					: body.action === "REVISE"
					? "IN_PROGRESS"
					: "MANAGER_REJECTED";

			const fallbackNote =
				body.action === "APPROVE"
					? "Disetujui oleh Manajer TU"
					: body.action === "REVISE"
					? "Revisi oleh Manajer TU"
					: "Ditolak oleh Manajer TU";

			const values =
				letter.values && typeof letter.values === "object"
					? { ...(letter.values as Record<string, unknown>) }
					: {};

			if (body.signatureImage) {
				values.signatureImage = body.signatureImage;
			}
			if (body.signedAt) {
				values.signedAt = body.signedAt;
			}

			const [history] = await Prisma.$transaction([
				Prisma.letterHistory.create({
					data: {
						letterInstanceId: letter.id,
						actorId: user.id,
						status: nextStatus,
						note: body.note ?? fallbackNote,
					},
				}),
				Prisma.letterInstance.update({
					where: { id: letter.id },
					data: { status: nextStatus, values },
				}),
			]);

			return history;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				action: t.Union([
					t.Literal("APPROVE"),
					t.Literal("REVISE"),
					t.Literal("REJECT"),
				]),
				note: t.Optional(t.String()),
				signatureImage: t.Optional(t.String()),
				signedAt: t.Optional(t.String()),
			}),
			...requireRole("manager_tu"),
		},
	)
	.post(
		"/:id/actions/upa",
		async ({ params: { id }, body, user, status }) => {
			const letter = await Prisma.letterInstance.findFirst({
				where: { id },
			});

			if (!letter) {
				return status(404);
			}

			if (letter.status !== "UPA_REVIEW") {
				return status(409, { error: "INVALID_STATUS" });
			}

			const values =
				letter.values && typeof letter.values === "object"
					? (letter.values as Record<string, unknown>)
					: {};

			if (body.nomorSurat) {
				values.nomorSurat = body.nomorSurat;
			}

			const [history] = await Prisma.$transaction([
				Prisma.letterHistory.create({
					data: {
						letterInstanceId: letter.id,
						actorId: user.id,
						status: "DONE",
						note: body.note ?? "Nomor surat diberikan oleh UPA",
					},
				}),
				Prisma.letterInstance.update({
					where: { id: letter.id },
					data: { status: "DONE", values },
				}),
			]);

			return history;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				action: t.Literal("NUMBER"),
				nomorSurat: t.Optional(t.String()),
				note: t.Optional(t.String()),
			}),
			...requireRole("upa"),
		},
	)
	.post(
		"/:id/history",
		async ({ params: { id }, query, body, user, status }) => {
			const scope = query.scope;
			const where =
				scope === "all"
					? { id }
					: {
							id,
							createdById: user.id,
						};

			const letter = await Prisma.letterInstance.findFirst({
				where,
			});

			if (!letter) {
				return status(404);
			}

			const updateData: {
				status: typeof body.status;
				values?: Record<string, unknown>;
			} = {
				status: body.status,
			};

			if (typeof body.values !== "undefined") {
				updateData.values = body.values;
			}

			const [history] = await Prisma.$transaction([
				Prisma.letterHistory.create({
					data: {
						letterInstanceId: letter.id,
						actorId: user.id,
						status: body.status,
						note: body.note,
					},
				}),
				Prisma.letterInstance.update({
					where: { id: letter.id },
					data: updateData,
				}),
			]);

			return history;
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			query: t.Object({
				scope: t.Optional(t.String()),
			}),
			body: t.Object({
				status: t.Union([
					t.Literal("PENDING"),
					t.Literal("IN_PROGRESS"),
					t.Literal("COMPLETED"),
					t.Literal("UPA_REVIEW"),
					t.Literal("DONE"),
					t.Literal("MANAGER_REJECTED"),
					t.Literal("REJECTED"),
				]),
				note: t.Optional(t.String()),
				values: t.Optional(t.Record(t.String(), t.Any())),
			}),
		},
	);
