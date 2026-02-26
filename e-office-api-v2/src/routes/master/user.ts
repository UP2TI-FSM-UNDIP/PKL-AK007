import { authGuardPlugin, requirePermission } from "@backend/middlewares/auth.ts";
import { Prisma } from "@backend/db/index.ts";
import { Elysia, t } from "elysia";
import { hashPassword } from "better-auth/crypto";
import { auth } from "@backend/lib/auth.ts";

const cleanupUserData = async (id: string) => {
	const anonymizedEmail = `deleted+${id}+${Date.now()}@ak007.test`;
	await Prisma.$transaction([
		Prisma.session.deleteMany({ where: { userId: id } }),
		Prisma.account.deleteMany({ where: { userId: id } }),
		Prisma.userRole.deleteMany({ where: { userId: id } }),
		Prisma.mahasiswa.deleteMany({ where: { userId: id } }),
		Prisma.pegawai.deleteMany({ where: { userId: id } }),
		Prisma.user.update({
			where: { id },
			data: {
				deletedAt: new Date(),
				email: anonymizedEmail,
				name: "Deleted User",
			},
		}),
	]);
};

const EMAIL_DOMAIN = "ak007.test";
const PHONE_REGEX = /^\+628\d{8,11}$/;

const normalizeEmail = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return "";
	const local = trimmed.split("@")[0];
	return `${local}@${EMAIL_DOMAIN}`.toLowerCase();
};

const toTitleCase = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/(^|\s)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);

export default new Elysia()
	.use(authGuardPlugin)
	.get(
		"/all",
		async ({ query }) => {
			const page = Number(query.page ?? 1);
			const take = Number(query.take ?? 0);
			const shouldPaginate = Number.isFinite(take) && take > 0;
			const search = query.search?.trim();
			const role = query.role?.trim();
			const status = query.status?.trim();

			const where: Record<string, unknown> = {};

			if (status === "active") {
				where.deletedAt = null;
			}
			if (status === "inactive") {
				where.deletedAt = { not: null };
			}
			if (search) {
				where.OR = [
					{ name: { contains: search, mode: "insensitive" } },
					{ email: { contains: search, mode: "insensitive" } },
					{ pegawai: { nip: { contains: search } } },
					{ mahasiswa: { nim: { contains: search } } },
				];
			}
			if (role) {
				where.userRole = {
					some: {
						role: { name: role },
					},
				};
			}

			if (!shouldPaginate) {
				return Prisma.user.findMany({
					where,
					include: {
						mahasiswa: true,
						pegawai: true,
						userRole: {
							include: {
								role: true,
							},
						},
					},
					orderBy: { createdAt: "desc" },
				});
			}

			const [items, total] = await Prisma.$transaction([
				Prisma.user.findMany({
					where,
					include: {
						mahasiswa: true,
						pegawai: true,
						userRole: {
							include: {
								role: true,
							},
						},
					},
					orderBy: { createdAt: "desc" },
					skip: (page - 1) * take,
					take,
				}),
				Prisma.user.count({ where }),
			]);

			return {
				items,
				total,
				page,
				pageSize: take,
			};
		},
		{
			...requirePermission("user", "read"),
			body: t.Object({}),
			query: t.Object({
				page: t.Optional(t.Numeric()),
				take: t.Optional(t.Numeric()),
				search: t.Optional(t.String()),
				role: t.Optional(t.String()),
				status: t.Optional(t.String()),
			}),
		},
	)
	.get(
		"/check-email",
		async ({ query, status }) => {
			const email = normalizeEmail(query.email ?? "");
			if (!email) {
				return status(400, { error: "Email is required" });
			}
			const existing = await Prisma.user.findFirst({
				where: { email },
				select: { id: true },
			});
			return { email, available: !existing };
		},
		{
			...requirePermission("user", "read"),
			body: t.Object({}),
			query: t.Object({
				email: t.String(),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, status }) => {
			const user = await Prisma.user.findUnique({
				where: { id },
				include: {
					mahasiswa: true,
					pegawai: true,
					userRole: {
						include: {
							role: true,
						},
					},
				},
			});

			if (!user) {
				return status(404, { error: "User not found" });
			}

			return user;
		},
		{
			params: t.Object({ id: t.String() }),
			...requirePermission("user", "read"),
		},
	)
	.post(
		"/",
		async ({
			body: {
				name,
				email,
				password,
				roleName,
				nim,
				tahunMasuk,
				noHp,
				alamat,
				tempatLahir,
				tanggalLahir,
				departemenId,
				programStudiId,
				nip,
				jabatan,
			},
			status,
		}) => {
			try {
				const normalizedEmail = normalizeEmail(email);
				if (!normalizedEmail) {
					return status(400, { error: "Email is required" });
				}
				const normalizedName = toTitleCase(name);
				const roleAliases: Record<string, string> = {
					mahasiswa: "mahasiswa",
					Mahasiswa: "mahasiswa",
					supervisor_akademik: "supervisor_akademik",
					"Supervisor Akademik": "supervisor_akademik",
					manager_tu: "manager_tu",
					"Manajer TU": "manager_tu",
					upa: "upa",
					UPA: "upa",
					superadmin: "superadmin",
					Superadmin: "superadmin",
				};
				const resolvedRoleName = roleName
					? roleAliases[roleName] ?? roleName
					: undefined;
				if (resolvedRoleName === "mahasiswa") {
					if (!nim || !tahunMasuk || !noHp || !departemenId || !programStudiId) {
						return status(400, { error: "Mahasiswa data is incomplete" });
					}
					if (!/^\d{14}$/.test(nim)) {
						return status(400, { error: "NIM must be 14 digits" });
					}
					if (!/^\d{4}$/.test(tahunMasuk)) {
						return status(400, { error: "Tahun masuk must be 4 digits" });
					}
					const currentYear = new Date().getFullYear();
					if (Number(tahunMasuk) > currentYear) {
						return status(400, { error: "Tahun masuk cannot be in the future" });
					}
					if (!PHONE_REGEX.test(noHp)) {
						return status(400, {
							error: "Nomor HP must start with +62, first digit 8, total 9-12 digits",
						});
					}
				} else if (resolvedRoleName && resolvedRoleName !== "mahasiswa") {
					if (!nip) {
						return status(400, { error: "Pegawai data is incomplete" });
					}
					if (!/^\d{18}$/.test(nip)) {
						return status(400, { error: "NIP must be 18 digits" });
					}
					if (noHp && !PHONE_REGEX.test(noHp)) {
						return status(400, {
							error: "Nomor HP must start with +62, first digit 8, total 9-12 digits",
						});
					}
				}
				const existing = await Prisma.user.findFirst({
					where: { email: normalizedEmail },
					select: { id: true },
				});
				if (existing) {
					return status(409, { error: "Email already exists", email: normalizedEmail });
				}
				const signUp = await auth.api.signUpEmail({
					body: {
						name: normalizedName,
						email: normalizedEmail,
						password: password?.trim() || "password123",
					},
				});

				if (resolvedRoleName) {
					const role =
						(await Prisma.role.findUnique({ where: { name: resolvedRoleName } })) ??
						(await Prisma.role.create({ data: { name: resolvedRoleName } }));
					await Prisma.userRole.create({
						data: {
							userId: signUp.user.id,
							roleId: role.id,
						},
					});
				}

				if (resolvedRoleName === "mahasiswa") {
					await Prisma.mahasiswa.create({
						data: {
							userId: signUp.user.id,
							nim,
							tahunMasuk,
							noHp,
							alamat: alamat || null,
							tempatLahir: tempatLahir || null,
							tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
							departemenId,
							programStudiId,
						},
					});
				} else if (resolvedRoleName && resolvedRoleName !== "mahasiswa") {
					await Prisma.pegawai.create({
						data: {
							userId: signUp.user.id,
							nip,
							jabatan: jabatan || resolvedRoleName,
							noHp: noHp || null,
							departemenId: departemenId || null,
							programStudiId: programStudiId || null,
						},
					});
				}

				return {
					message: "User created successfully",
					user: signUp.user,
				};
			} catch (error) {
				return status(400, {
					error: "Failed to create user",
				});
			}
		},
		{
			...requirePermission("user", "create"),
			body: t.Object({
				name: t.String(),
				email: t.String(),
				password: t.Optional(t.String()),
				roleName: t.Optional(t.String()),
				nim: t.Optional(t.String()),
				tahunMasuk: t.Optional(t.String()),
				noHp: t.Optional(t.String()),
				alamat: t.Optional(t.String()),
				tempatLahir: t.Optional(t.String()),
				tanggalLahir: t.Optional(t.String()),
				departemenId: t.Optional(t.String()),
				programStudiId: t.Optional(t.String()),
				nip: t.Optional(t.String()),
				jabatan: t.Optional(t.String()),
			}),
		},
	)
	.patch(
		"/",
		async ({ body: { id, name } }) => {
			const letter = await UserService.update(id, {
				name: name,
			});

			return {
				message: "User update successfully",
				letter,
			};
		},
		{
			...requirePermission("user", "write"),
			body: t.Object({
				id: t.String(),
				name: t.Optional(t.String()),
			}),
		},
		)
		.put(
		"/:id",
		async ({ params: { id }, body, status }) => {
			const existing = await Prisma.user.findUnique({
				where: { id },
				include: {
					mahasiswa: true,
					pegawai: true,
				},
			});
			if (!existing) {
				return status(404, { error: "User not found" });
			}

			const updateUser: Record<string, unknown> = {};
			if (typeof body.name === "string") {
				updateUser.name = toTitleCase(body.name);
			}

			if (Object.keys(updateUser).length) {
				await Prisma.user.update({
					where: { id },
					data: updateUser,
				});
			}

			const isMahasiswa =
				Boolean(existing.mahasiswa) ||
				Boolean(
					body.nim ||
						body.tahunMasuk ||
						body.departemenId ||
						body.programStudiId ||
						body.tempatLahir ||
						body.tanggalLahir,
				);

			const hasMahasiswaPayload =
				isMahasiswa &&
				(body.nim ||
					body.tahunMasuk ||
					body.alamat ||
					body.tempatLahir ||
					body.tanggalLahir ||
					body.departemenId ||
					body.programStudiId ||
					body.noHp);

			const hasPegawaiPayload = !isMahasiswa && (body.nip || body.jabatan || body.noHp);

			if (hasMahasiswaPayload) {
				if (body.nim && !/^\d{14}$/.test(body.nim)) {
					return status(400, { error: "NIM must be 14 digits" });
				}
				if (body.tahunMasuk && !/^\d{4}$/.test(body.tahunMasuk)) {
					return status(400, { error: "Tahun masuk must be 4 digits" });
				}
				if (body.noHp && !PHONE_REGEX.test(body.noHp)) {
					return status(400, {
						error: "Nomor HP must start with +62, first digit 8, total 9-12 digits",
					});
				}
				if (!body.departemenId || !body.programStudiId) {
					return status(400, { error: "Departemen dan Program Studi wajib diisi" });
				}
				await Prisma.mahasiswa.upsert({
					where: { userId: id },
					update: {
						nim: body.nim ?? undefined,
						tahunMasuk: body.tahunMasuk ?? undefined,
						noHp: body.noHp ?? undefined,
						alamat: body.alamat ?? undefined,
						tempatLahir: body.tempatLahir ?? undefined,
						tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : undefined,
						departemenId: body.departemenId ?? undefined,
						programStudiId: body.programStudiId ?? undefined,
					},
					create: {
						user: { connect: { id } },
						nim: body.nim ?? "",
						tahunMasuk: body.tahunMasuk ?? "",
						noHp: body.noHp ?? "",
						alamat: body.alamat ?? null,
						tempatLahir: body.tempatLahir ?? null,
						tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
						departemenId: body.departemenId,
						programStudiId: body.programStudiId,
					},
				});
			}

			if (hasPegawaiPayload) {
				if (body.nip && !/^\d{18}$/.test(body.nip)) {
					return status(400, { error: "NIP must be 18 digits" });
				}
				if (body.noHp && !PHONE_REGEX.test(body.noHp)) {
					return status(400, {
						error: "Nomor HP must start with +62, first digit 8, total 9-12 digits",
					});
				}
				await Prisma.pegawai.upsert({
					where: { userId: id },
					update: {
						nip: body.nip ?? undefined,
						jabatan: body.jabatan ?? undefined,
						noHp: body.noHp ?? undefined,
					},
					create: {
						user: { connect: { id } },
						nip: body.nip ?? "",
						jabatan: body.jabatan ?? "",
						noHp: body.noHp ?? null,
					},
				});
			}

			const updated = await Prisma.user.findUnique({
				where: { id },
				include: {
					mahasiswa: true,
					pegawai: true,
					userRole: { include: { role: true } },
				},
			});

			return {
				message: "User updated successfully",
				user: updated,
			};
		},
		{
			params: t.Object({ id: t.String() }),
			...requirePermission("user", "write"),
			body: t.Object({
				name: t.Optional(t.String()),
				nim: t.Optional(t.String()),
				tahunMasuk: t.Optional(t.String()),
				noHp: t.Optional(t.String()),
				alamat: t.Optional(t.String()),
				tempatLahir: t.Optional(t.String()),
				tanggalLahir: t.Optional(t.String()),
				departemenId: t.Optional(t.String()),
				programStudiId: t.Optional(t.String()),
				nip: t.Optional(t.String()),
				jabatan: t.Optional(t.String()),
			}),
		},
		)
		.post(
		"/:id/reset-password",
		async ({ params: { id }, body }) => {
			const newPassword = body.password?.trim() || "password123";
			const passwordHash = await hashPassword(newPassword);

			await Prisma.account.updateMany({
				where: { userId: id },
				data: { password: passwordHash },
			});

			return { message: "Password reset", password: newPassword };
		},
		{
			params: t.Object({ id: t.String() }),
			body: t.Object({ password: t.Optional(t.String()) }),
			...requirePermission("user", "write"),
		},
	)
	.post(
		"/:id/deactivate",
		async ({ params: { id }, status }) => {
			const existing = await Prisma.user.findUnique({
				where: { id },
				select: { id: true },
			});
			if (!existing) {
				return status(404, { error: "User not found" });
			}
			await Prisma.user.update({
				where: { id },
				data: { deletedAt: new Date() },
			});

			return { message: "User deactivated" };
		},
		{
			params: t.Object({ id: t.String() }),
			...requirePermission("user", "write"),
		},
	)
	.post(
		"/:id/activate",
		async ({ params: { id }, status }) => {
			const existing = await Prisma.user.findUnique({
				where: { id },
				select: { id: true },
			});
			if (!existing) {
				return status(404, { error: "User not found" });
			}
			await Prisma.user.update({
				where: { id },
				data: { deletedAt: null },
			});

			return { message: "User activated" };
		},
		{
			params: t.Object({ id: t.String() }),
			...requirePermission("user", "write"),
		},
	)
	.post(
		"/:id/delete-data",
		async ({ params: { id }, status }) => {
			const existing = await Prisma.user.findUnique({
				where: { id },
				select: { id: true },
			});
			if (!existing) {
				return status(404, { error: "User not found" });
			}
			await cleanupUserData(id);

			return { message: "User data deleted" };
		},
		{
			params: t.Object({ id: t.String() }),
			...requirePermission("user", "write"),
		},
	);
