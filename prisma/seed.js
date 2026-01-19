import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "mahasiswa" },
      { name: "spvak" },
      { name: "mantu" },
      { name: "upa" },
    ],
    skipDuplicates: true,
  });

  const roles = await prisma.role.findMany();
  const roleId = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  await prisma.user.createMany({
    data: [
      {
        email: "user@mahasiswa.com",
        password: "password123",
        roleId: roleId["mahasiswa"],
      },
      {
        email: "user@spvak.com",
        password: "password123",
        roleId: roleId["spvak"],
      },
      {
        email: "user@mantu.com",
        password: "password123",
        roleId: roleId["mantu"],
      },
      {
        email: "user@upa.com",
        password: "password123",
        roleId: roleId["upa"],
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
