import { Prisma } from "./src/db/index";

async function main() {
  const users = await Prisma.user.findMany({
    include: {
      userRole: {
        include: {
          role: true
        }
      }
    }
  });
  console.log(JSON.stringify(users.map(u => ({ email: u.email, name: u.name, roles: u.userRole.map(ur => ur.role.name) })), null, 2));
}

main().catch(console.error).finally(() => Prisma.$disconnect());
