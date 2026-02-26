import { Prisma } from "@backend/db/index.ts";

const resolveRoleName = (user: {
	email: string;
	mahasiswa: unknown | null;
	pegawai: { jabatan?: string | null } | null;
}) => {
	const email = user.email.toLowerCase();
	if (email === "dubi@ak007.test") return "mahasiswa";
	if (email === "supervisor@ak007.test") return "supervisor_akademik";
	if (email === "admin@university.ac.id") return "superadmin";
	if (email.includes("superadmin")) return "superadmin";
	if (user.mahasiswa) return "mahasiswa";

	const jabatan = user.pegawai?.jabatan?.toLowerCase() ?? "";
	if (jabatan.includes("supervisor akademik")) return "supervisor_akademik";
	if (jabatan.includes("manajer tu") || jabatan.includes("manager tu"))
		return "manager_tu";
	if (jabatan.includes("upa")) return "upa";

	return null;
};

async function main() {
	console.log("Backfill user roles...");
	const users = await Prisma.user.findMany({
		where: { userRole: { none: {} } },
		select: {
			id: true,
			email: true,
			mahasiswa: { select: { id: true } },
			pegawai: { select: { jabatan: true } },
		},
	});

	let assigned = 0;
	let skipped = 0;

	for (const user of users) {
		const roleName = resolveRoleName(user);
		if (!roleName) {
			skipped += 1;
			console.log("Skip user without role mapping:", user.email);
			continue;
		}

		const role = await Prisma.role.upsert({
			where: { name: roleName },
			update: {},
			create: { name: roleName },
		});

		await Prisma.userRole.upsert({
			where: {
				userId_roleId: { userId: user.id, roleId: role.id },
			},
			update: {},
			create: { userId: user.id, roleId: role.id },
		});

		assigned += 1;
	}

	console.log(`Backfill done. assigned=${assigned} skipped=${skipped}`);
}

main()
	.then(() => Prisma.$disconnect())
	.catch(async (error) => {
		console.error("Backfill failed:", error);
		await Prisma.$disconnect();
		process.exit(1);
	});
