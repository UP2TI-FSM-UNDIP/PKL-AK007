import "dotenv/config";
import { Prisma } from "@backend/db/index.ts";
import { auth } from "@backend/lib/auth.ts";

async function main() {
	const email = "manajer.tu@ak007.test";
	const password = "password123";
	const name = "Manajer TU";

	const role = await Prisma.role.upsert({
		create: { name: "manager_tu" },
		update: {},
		where: { name: "manager_tu" },
	});

	let user = await Prisma.user.findUnique({ where: { email } });
	if (!user) {
		const response = await auth.api.signUpEmail({
			body: { email, password, name },
		});
		user = response.user;
	}

	await Prisma.userRole.createMany({
		data: [{ userId: user.id, roleId: role.id }],
		skipDuplicates: true,
	});

	console.log(`Manager user ready: ${email}`);
}

main()
	.catch((error) => {
		console.error("Failed to create manager user:", error);
		process.exit(1);
	})
	.finally(async () => {
		await Prisma.$disconnect();
	});
