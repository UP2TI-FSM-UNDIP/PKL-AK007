import { PrismaClient } from "./src/generated/prisma/client.ts";

const prisma = new PrismaClient();

async function main() {
  try {
    const rolesWithCounts = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      }
    });
    console.log("Current Roles and User Counts in Database:");
    console.log(JSON.stringify(rolesWithCounts, null, 2));
  } catch (error) {
    console.error("Error fetching roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
