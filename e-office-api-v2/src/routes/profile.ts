import { authGuardPlugin } from "@backend/middlewares/auth";
import { Prisma } from "@backend/db/index";
import { Elysia, t } from "elysia";

const getActivityAction = ({
	status,
	actorId,
	createdById,
	note,
	userId,
}: {
	status: string;
	actorId: string | null;
	createdById: string | null;
	note: string | null;
	userId: string;
}) => {
	const isActor = actorId === userId;
	const isOwner = createdById === userId;

	if (isOwner) {
		if (status === "PENDING" && isActor) return "Mengajukan surat";
		if (status === "IN_PROGRESS" && !isActor) return "Diminta revisi";
		if (status === "DONE") return "Surat selesai";
		if (status === "COMPLETED" || status === "UPA_REVIEW")
			return "Surat disetujui";
		if (status === "REJECTED" || status === "MANAGER_REJECTED")
			return "Surat ditolak";
	}

	if (isActor) {
		if (status === "IN_PROGRESS") return "Meminta revisi";
		if (status === "DONE") return "Menyelesaikan surat";
		if (status === "COMPLETED" || status === "UPA_REVIEW")
			return "Menyetujui surat";
		if (status === "REJECTED" || status === "MANAGER_REJECTED")
			return "Menolak surat";
	}

	if (note && note.toLowerCase().includes("revisi")) {
		return "Perubahan revisi";
	}

	return "Memproses surat";
};

const mahasiswaSchema = t.Object({
	nim: t.Optional(t.String()),
	tahunMasuk: t.Optional(t.String()),
	programStudiId: t.Optional(t.String()),
	noHp: t.Optional(t.String()),
	alamat: t.Optional(t.String()),
	tempatLahir: t.Optional(t.String()),
	tanggalLahir: t.Optional(t.String()),
});

const pegawaiSchema = t.Object({
	noHp: t.Optional(t.String()),
	jabatan: t.Optional(t.String()),
	signatureImage: t.Optional(t.String()),
});

export default new Elysia()
	.use(authGuardPlugin)
	.get("/", async ({ user, status }) => {
		const profile = await Prisma.user.findUnique({
			where: { id: user.id },
			include: {
				mahasiswa: {
					include: {
						departemen: true,
						programStudi: true,
					},
				},
				pegawai: {
					include: {
						departemen: true,
						programStudi: true,
					},
				},
				userRole: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!profile) {
			return status(404);
		}

		return profile;
	})
	.get(
		"/activity",
		async ({ user, query }) => {
			const take = Math.min(Number(query.take ?? 5), 50);

			const logs = await Prisma.letterHistory.findMany({
				where: {
					OR: [
						{ actorId: user.id },
						{ letterInstance: { createdById: user.id } },
					],
				},
				orderBy: { createdAt: "desc" },
				take,
				include: {
					letterInstance: {
						include: {
							letterType: true,
						},
					},
				},
			});

			return logs.map((log) => ({
				id: log.id,
				status: log.status,
				action: getActivityAction({
					status: log.status,
					actorId: log.actorId,
					createdById: log.letterInstance?.createdById ?? null,
					note: log.note ?? null,
					userId: user.id,
				}),
				detail: log.letterInstance?.letterType?.name ?? "-",
				note: log.note ?? "",
				createdAt: log.createdAt,
				letterId: log.letterInstanceId,
			}));
		},
		{
			query: t.Object({
				take: t.Optional(t.Numeric()),
			}),
		},
	)
	.put(
		"/",
		async ({ user, body, status }) => {
			const profile = await Prisma.user.findUnique({
				where: { id: user.id },
				include: {
					mahasiswa: true,
					pegawai: true,
				},
			});

			if (!profile) {
				return status(404);
			}

			if (body.mahasiswa && !profile.mahasiswa) {
				return status(400, { error: "Mahasiswa profile not found" });
			}

			if (body.pegawai && !profile.pegawai) {
				return status(400, { error: "Pegawai profile not found" });
			}

			const updateData: Record<string, unknown> = {};

			if (typeof body.name !== "undefined") updateData.name = body.name;
			if (typeof body.image !== "undefined") updateData.image = body.image;

			if (body.mahasiswa) {
				updateData.mahasiswa = {
					update: {
						...body.mahasiswa,
						tanggalLahir: body.mahasiswa.tanggalLahir
							? new Date(body.mahasiswa.tanggalLahir)
							: undefined,
					},
				};
			}

			if (body.pegawai) {
				updateData.pegawai = {
					update: {
						...body.pegawai,
					},
				};
			}

			const updated = await Prisma.user.update({
				where: { id: user.id },
				data: updateData,
				include: {
					mahasiswa: {
						include: {
							departemen: true,
							programStudi: true,
						},
					},
					pegawai: {
						include: {
							departemen: true,
							programStudi: true,
						},
					},
					userRole: {
						include: {
							role: true,
						},
					},
				},
			});

			return updated;
		},
		{
			body: t.Object({
				name: t.Optional(t.String()),
				image: t.Optional(t.String()),
				mahasiswa: t.Optional(mahasiswaSchema),
				pegawai: t.Optional(pegawaiSchema),
			}),
		},
	);
