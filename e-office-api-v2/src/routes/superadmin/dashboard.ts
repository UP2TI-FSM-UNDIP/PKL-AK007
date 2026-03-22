import { authGuardPlugin, requireRole } from "@backend/middlewares/auth";
import { Prisma } from "@backend/db/index";
import { Elysia } from "elysia";

const STATUS_LABELS: Record<string, string> = {
	PENDING: "Menunggu Verifikasi",
	IN_PROGRESS: "Sedang Diproses",
	COMPLETED: "Selesai",
	UPA_REVIEW: "Review UPA",
	DONE: "Selesai",
	MANAGER_REJECTED: "Ditolak",
	REJECTED: "Ditolak",
};

const prettyRole = (roleName?: string | null) => {
	if (!roleName) return "-";
	return roleName.replace(/_/g, " ");
};

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/",
		async () => {
			const [
				totalSurat,
				totalUser,
				suratPending,
				suratDitolak,
				statusGroups,
				userRoles,
				recentHistory,
			] = await Promise.all([
				Prisma.letterInstance.count(),
				Prisma.user.count({ where: { deletedAt: null } }),
				Prisma.letterInstance.count({ where: { status: "PENDING" } }),
				Prisma.letterInstance.count({
					where: { status: { in: ["REJECTED", "MANAGER_REJECTED"] } },
				}),
				Prisma.letterInstance.groupBy({
					by: ["status"],
					_count: { status: true },
				}),
				Prisma.userRole.findMany({
					where: {
						user: { deletedAt: null },
					},
					include: { role: true },
				}),
				Prisma.letterHistory.findMany({
					orderBy: { createdAt: "desc" },
					take: 5,
					include: {
						actor: {
							include: {
								userRole: { include: { role: true } },
							},
						},
					},
				}),
			]);

			const roleCounts = userRoles.reduce<Record<string, number>>(
				(acc, item) => {
					const roleName = item.role?.name ?? "unknown";
					acc[roleName] = (acc[roleName] ?? 0) + 1;
					return acc;
				},
				{},
			);

			const statusSummary = statusGroups.map((group) => ({
				status: group.status,
				label: STATUS_LABELS[group.status] ?? group.status,
				count: group._count.status,
			}));

			const activityLogs = recentHistory.map((log) => {
				const roleName = log.actor?.userRole?.[0]?.role?.name;
				return {
					id: log.id,
					status: log.status,
					note: log.note ?? "",
					actorName: log.actor?.name ?? "-",
					actorRole: prettyRole(roleName),
					createdAt: log.createdAt,
				};
			});

			return {
				stats: {
					totalSurat,
					totalUser,
					suratPending,
					suratDitolak,
					roleCounts,
				},
				statusSummary,
				activityLogs,
			};
		},
		{
			...requireRole("superadmin"),
		},
	);
