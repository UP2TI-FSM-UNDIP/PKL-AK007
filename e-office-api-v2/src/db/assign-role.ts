import { Prisma } from "@backend/db/index.ts";

const [emailArg, roleArg] = process.argv.slice(2);
const email = emailArg?.trim();
const roleName = roleArg?.trim() || "Supervisor Akademik";

if (!email) {
  console.error("Usage: bun run src/db/assign-role.ts <email> [roleName]");
  process.exit(1);
}

const run = async () => {
  const user = await Prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  const role =
    (await Prisma.role.findUnique({ where: { name: roleName } })) ??
    (await Prisma.role.create({ data: { name: roleName } }));

  await Prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: role.id,
    },
  });

  console.log(`Assigned role "${role.name}" to ${email}`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await Prisma.$disconnect();
  });
