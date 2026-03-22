import { authGuardPlugin, requireRole } from "@backend/middlewares/auth";
import { Prisma } from "@backend/db/index";
import { Elysia, t } from "elysia";

const prettyRole = (roleName?: string | null) => {
	if (!roleName) return "-";
	return roleName.replace(/_/g, " ");
};

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/",
		async ({ query }) => {
			const take = Math.min(Number(query.take ?? 50), 200);
			const page = Number(query.page ?? 1);
			const shouldPaginate = Number.isFinite(take) && take > 0;
			const search = query.search?.trim();
			const statusList = query.status
				? query.status.split(",").map((item) => item.trim()).filter(Boolean)
				: [];
			const ipSearch = query.ip?.trim();

			const where: Record<string, unknown> = {};

			if (statusList.length) {
				where.status = { in: statusList };
			}
			if (search) {
				where.OR = [
					{ note: { contains: search, mode: "insensitive" } },
					{ actor: { name: { contains: search, mode: "insensitive" } } },
					{
						letterInstance: {
							letterType: { name: { contains: search, mode: "insensitive" } },
						},
					},
				];
			}
			if (query.startDate || query.endDate) {
				where.createdAt = {
					...(query.startDate ? { gte: new Date(query.startDate) } : {}),
					...(query.endDate ? { lte: new Date(query.endDate) } : {}),
				};
			}
			if (ipSearch) {
				where.actor = {
					...((where.actor as Record<string, unknown>) ?? {}),
					sessions: {
						some: {
							ipAddress: { contains: ipSearch },
						},
					},
				};
			}

			const logs = await Prisma.letterHistory.findMany({
				where,
				orderBy: { createdAt: "desc" },
				take,
				skip: shouldPaginate ? (page - 1) * take : undefined,
				include: {
					actor: {
						include: {
							userRole: { include: { role: true } },
							sessions: {
								orderBy: { updatedAt: "desc" },
								take: 1,
							},
						},
					},
					letterInstance: {
						include: {
							letterType: true,
						},
					},
				},
			});

			const items = logs.map((log) => {
				const roleName = log.actor?.userRole?.[0]?.role?.name;
				const ipAddress = log.actor?.sessions?.[0]?.ipAddress ?? "-";
				return {
					id: log.id,
					status: log.status,
					note: log.note ?? "",
					actorName: log.actor?.name ?? "-",
					actorRole: prettyRole(roleName),
					ipAddress,
					letterType: log.letterInstance?.letterType?.name ?? "-",
					createdAt: log.createdAt,
				};
			});

			if (!shouldPaginate) {
				return items;
			}

			const total = await Prisma.letterHistory.count({ where });
			return {
				items,
				total,
				page,
				pageSize: take,
			};
		},
		{
			query: t.Object({
				take: t.Optional(t.Numeric()),
				page: t.Optional(t.Numeric()),
				search: t.Optional(t.String()),
				status: t.Optional(t.String()),
				startDate: t.Optional(t.String()),
				endDate: t.Optional(t.String()),
				ip: t.Optional(t.String()),
			}),
			...requireRole("superadmin"),
		},
	);
