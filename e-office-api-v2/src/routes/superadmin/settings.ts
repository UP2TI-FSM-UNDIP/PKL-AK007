import { authGuardPlugin, requireRole } from "@backend/middlewares/auth";
import { Prisma } from "@backend/db/index";
import { Elysia, t } from "elysia";

const DEFAULT_SETTINGS = {
	penomoranOtomatis: true,
	formatNomor: "012/XX/FSM/UNDIP/IV/2024",
	tahunAkademik: "2023/2024",
	namaAplikasi: "Sistem Persuratan FSM UNDIP",
	alamatPengirim: "noreply@undip.ac.id",
	notifikasiEmail: true,
	logoUrl: "",
	fakultasName: "Fakultas Sains dan Matematika",
	universitasName: "Universitas Diponegoro",
};

const normalizeData = (value: unknown) => {
	if (!value || typeof value !== "object") {
		return { ...DEFAULT_SETTINGS };
	}
	return { ...DEFAULT_SETTINGS, ...(value as Record<string, unknown>) };
};

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/",
		async () => {
			const current = await Prisma.systemSetting.findUnique({
				where: { key: "global" },
			});

			if (!current) {
				const created = await Prisma.systemSetting.create({
					data: {
						key: "global",
						data: DEFAULT_SETTINGS,
					},
				});
				return created.data;
			}

			return normalizeData(current.data);
		},
		{
			...requireRole("superadmin"),
		},
	)
	.put(
		"/",
		async ({ body }) => {
			const existing = await Prisma.systemSetting.findUnique({
				where: { key: "global" },
			});
			const currentData = existing?.data
				? normalizeData(existing.data)
				: { ...DEFAULT_SETTINGS };
			const merged = { ...currentData, ...body };

			const saved = await Prisma.systemSetting.upsert({
				where: { key: "global" },
				create: { key: "global", data: merged },
				update: { data: merged },
			});

			return saved.data;
		},
		{
			...requireRole("superadmin"),
			body: t.Object({
				penomoranOtomatis: t.Optional(t.Boolean()),
				formatNomor: t.Optional(t.String()),
				tahunAkademik: t.Optional(t.String()),
				namaAplikasi: t.Optional(t.String()),
				alamatPengirim: t.Optional(t.String()),
				notifikasiEmail: t.Optional(t.Boolean()),
				logoUrl: t.Optional(t.String()),
				fakultasName: t.Optional(t.String()),
				universitasName: t.Optional(t.String()),
			}),
		},
	);
