import { Prisma } from "@backend/db/index.ts";
import { randomBytes, scryptSync } from "crypto";

import { auth } from "@backend/lib/auth.ts";

async function main() {
	console.log("Starting database seed...");

	// "pemohon"
	// "supervisor akademik"
	// "manajer tu"
	// "upa"
	// "superadmin"
	// Roles
	const superAdminRole = await Prisma.role.upsert({
		create: {
			name: "superadmin",
		},
		update: {},
		where: {
			name: "superadmin",
		},
	});

	const mahasiswaRole = await Prisma.role.upsert({
		create: {
			name: "mahasiswa",
		},
		update: {},
		where: {
			name: "mahasiswa",
		},
	});

	const supervisorAkademikRole = await Prisma.role.upsert({
		create: {
			name: "supervisor_akademik",
		},
		update: {},
		where: {
			name: "supervisor_akademik",
		},
	});

	const managerTURole = await Prisma.role.upsert({
		create: {
			name: "manager_tu",
		},
		update: {},
		where: {
			name: "manager_tu",
		},
	});

	const upaRole = await Prisma.role.upsert({
		create: {
			name: "upa",
		},
		update: {},
		where: {
			name: "upa",
		},
	});

	console.log("User Upserted");

	// 2. Create Permissions
	const permissionSeeds = [
		// Departemen permission
		{ resource: "departemen", action: "create" },
		{ resource: "departemen", action: "read" },
		{ resource: "departemen", action: "update" },
		{ resource: "departemen", action: "delete" },

		// prodi
		{ resource: "prodi", action: "create" },
		{ resource: "prodi", action: "read" },
		{ resource: "prodi", action: "update" },
		{ resource: "prodi", action: "delete" },

		// role
		{ resource: "role", action: "create" },
		{ resource: "role", action: "read" },
		{ resource: "role", action: "update" },
		{ resource: "role", action: "delete" },

		// user include mahasiswa and pegawai
		{ resource: "user", action: "create" },
		{ resource: "user", action: "read" },
		{ resource: "user", action: "update" },
		{ resource: "user", action: "delete" },

		// lettertype
		{ resource: "letterType", action: "create" },
		{ resource: "letterType", action: "read" },
		{ resource: "letterType", action: "update" },
		{ resource: "letterType", action: "delete" },

		// letter template
		{ resource: "letterTemplate", action: "create" },
		{ resource: "letterTemplate", action: "read" },
		{ resource: "letterTemplate", action: "update" },
		{ resource: "letterTemplate", action: "delete" },

		// main transaction
		{ resource: "letter", action: "file" },
		{ resource: "letter", action: "disposition" },
		{ resource: "letter", action: "forward" },
		{ resource: "letter", action: "editOverlay" },
		{ resource: "letter", action: "numbering" },
	];

	const permissions = await Promise.all(
		permissionSeeds.map((permission) =>
			Prisma.permission.upsert({
				where: {
					resource_action: {
						resource: permission.resource,
						action: permission.action,
					},
				},
				update: {},
				create: permission,
			}),
		),
	);

	console.log("Permissions upserted");

	// 3. Assign Permissions to Roles
	// Admin gets all permissions
	await Prisma.rolePermission.createMany({
		data: permissions.map((permission) => ({
			roleId: superAdminRole.id,
			permissionId: permission.id,
		})),
		skipDuplicates: true,
	});

	// // Dosen gets letter approval permissions
	// await Promise.all(
	// 	permissions
	// 		.filter((p) =>
	// 			["letter:read", "letter:approve", "letter:reject"].includes(
	// 				`${p.resource}:${p.action}`,
	// 			),
	// 		)
	// 		.map((permission) =>
	// 			Prisma.rolePermission.create({
	// 				data: {
	// 					roleId: dosenRole.id,
	// 					permissionId: permission.id,
	// 				},
	// 			}),
	// 		),
	// );

	// Mahasiswa gets letter create and read
	await Prisma.rolePermission.createMany({
		data: permissions
			.filter((p) =>
				["letter:create", "letter:read"].includes(`${p.resource}:${p.action}`),
			)
			.map((permission) => ({
				roleId: mahasiswaRole.id,
				permissionId: permission.id,
			})),
		skipDuplicates: true,
	});

	console.log("Assigned permissions to roles");

	// Create Departemen
	const departemenMatematika = await Prisma.departemen.upsert({
		where: {
			code: "fsm_math",
		},
		update: {},
		create: {
			name: "Matematika",
			code: "fsm_math",
		},
	});

	const departemenBiologi = await Prisma.departemen.upsert({
		where: {
			code: "fsm_bio",
		},
		update: {},
		create: {
			name: "Biologi",
			code: "fsm_bio",
		},
	});

	const departemenKimia = await Prisma.departemen.upsert({
		where: {
			code: "fsm_kim",
		},
		update: {},
		create: {
			name: "Kimia",
			code: "fsm_kim",
		},
	});

	const departemenFisika = await Prisma.departemen.upsert({
		where: {
			code: "fsm_fis",
		},
		update: {},
		create: {
			name: "Fisika",
			code: "fsm_fis",
		},
	});

	const departemenStatistika = await Prisma.departemen.upsert({
		where: {
			code: "fsm_statis",
		},
		update: {},
		create: {
			name: "Statistika",
			code: "fsm_statis",
		},
	});

	const departemenInformatika = await Prisma.departemen.upsert({
		where: {
			code: "fsm_if",
		},
		update: {},
		create: {
			name: "Informatika",
			code: "fsm_if",
		},
	});

	const departemenFsm = await Prisma.departemen.upsert({
		where: {
			code: "fsm_main",
		},
		update: {},
		create: {
			name: "FSM",
			code: "fsm_main",
		},
	});

	// Program Studi
	const prodiInformatika = await Prisma.programStudi.upsert({
		where: {
			code: "240601",
		},
		update: {},
		create: {
			name: "S1 Informatika",
			code: "240601",
			departemenId: departemenInformatika.id,
		},
	});

	const prodiKimia = await Prisma.programStudi.upsert({
		where: {
			code: "240301",
		},
		update: {},
		create: {
			name: "S1 Kimia",
			code: "240301",
			departemenId: departemenKimia.id,
		},
	});

	const prodiFisikaS1 = await Prisma.programStudi.upsert({
		where: {
			code: "240401",
		},
		update: {},
		create: {
			name: "S1 Fisika",
			code: "240401",
			departemenId: departemenFisika.id,
		},
	});

	const prodiFisikaS2 = await Prisma.programStudi.upsert({
		where: {
			code: "240402",
		},
		update: {},
		create: {
			name: "S2 Fisika",
			code: "240402",
			departemenId: departemenFisika.id,
		},
	});

	const prodiMatematikaS1 = await Prisma.programStudi.upsert({
		where: {
			code: "240101",
		},
		update: {},
		create: {
			name: "S1 Matematika",
			code: "240101",
			departemenId: departemenMatematika.id,
		},
	});

	const prodiMatematikaS2 = await Prisma.programStudi.upsert({
		where: {
			code: "240102",
		},
		update: {},
		create: {
			name: "S2 Matematika",
			code: "240102",
			departemenId: departemenMatematika.id,
		},
	});

	const prodiStatistikaS1 = await Prisma.programStudi.upsert({
		where: {
			code: "240103",
		},
		update: {},
		create: {
			name: "S1 Statistika",
			code: "240103",
			departemenId: departemenStatistika.id,
		},
	});

	const prodiBiologiS1 = await Prisma.programStudi.upsert({
		where: {
			code: "240201",
		},
		update: {},
		create: {
			name: "S1 Biologi",
			code: "240201",
			departemenId: departemenBiologi.id,
		},
	});

	const prodiBioteknologiS1 = await Prisma.programStudi.upsert({
		where: {
			code: "240202",
		},
		update: {},
		create: {
			name: "S1 Bioteknologi",
			code: "240202",
			departemenId: departemenBiologi.id,
		},
	});

	const prodiBiologiS2 = await Prisma.programStudi.upsert({
		where: {
			code: "240203",
		},
		update: {},
		create: {
			name: "S2 Biologi",
			code: "240203",
			departemenId: departemenBiologi.id,
		},
	});

	const prodiFSM = await Prisma.programStudi.upsert({
		where: {
			code: "240111",
		},
		update: {},
		create: {
			name: "FSM",
			code: "240111",
			departemenId: departemenFsm.id,
		},
	});

	console.log("Created program studi");

	const existingAk007Type = await Prisma.letterType.findFirst({
		where: { name: "AK007" },
	});

	const ak007Type =
		existingAk007Type ??
		(await Prisma.letterType.create({
			data: {
				name: "AK007",
				description: "Surat Keterangan Mahasiswa",
			},
		}));

	const templateSchema = {
		title: "Surat Keterangan Mahasiswa",
		fields: [
			"nama",
			"nim",
			"programStudi",
			"birthPlace",
			"birthDate",
			"alamat",
			"semester",
			"keperluan",
			"tahunMulai",
			"tahunSelesai",
		],
	};

	const existingTemplate = await Prisma.letterTemplate.findFirst({
		where: { letterTypeId: ak007Type.id, versionName: "v1" },
	});

	if (!existingTemplate) {
		await Prisma.letterTemplate.create({
			data: {
				versionName: "v1",
				schemaDefinition: templateSchema,
				formFields: templateSchema,
				letterTypeId: ak007Type.id,
			},
		});
	}

	console.log("Created letter template");

	// Create Users
	const adminUser = await Prisma.user.create({
		data: {
			name: "Admin Sistem",
			email: "admin@university.ac.id",
			emailVerified: true,
		},
	});

	const getOrCreateUser = async ({
		email,
		password,
		name,
	}: {
		email: string;
		password: string;
		name: string;
	}) => {
		const existing = await Prisma.user.findUnique({ where: { email } });
		if (existing) return existing;
		const response = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name,
			},
		});
		return response.user;
	};

	const seededUsers = [
		{ name: "Superadmin", email: "superadmin@ak007.test", roleId: superAdminRole.id },
		{ name: "Mahasiswa", email: "mahasiswa@ak007.test", roleId: mahasiswaRole.id },
		{ name: "Supervisor Akademik", email: "supervisor.akademik@ak007.test", roleId: supervisorAkademikRole.id },
		{ name: "Manajer TU", email: "manajer.tu@ak007.test", roleId: managerTURole.id },
		{ name: "UPA", email: "upa@ak007.test", roleId: upaRole.id },
	];

	const createdUsers = await Promise.all(
		seededUsers.map((user) =>
			getOrCreateUser({
				email: user.email,
				password: "password123",
				name: user.name,
			}),
		),
	);

	await Prisma.userRole.createMany({
		data: createdUsers.map((user, index) => ({
			userId: user.id,
			roleId: seededUsers[index].roleId,
		})),
		skipDuplicates: true,
	});

	console.log("Assigned roles to users");
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await Prisma.$disconnect();
	});
