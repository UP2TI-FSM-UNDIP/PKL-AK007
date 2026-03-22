import { Prisma } from "./src/db/index";

async function main() {
  const user = await Prisma.user.findUnique({
    where: { email: "adminfakultas" }
  });
  if (user) {
    await Prisma.userRole.deleteMany({
      where: { userId: user.id }
    });
    await Prisma.user.delete({
      where: { email: "adminfakultas" }
    });
    console.log("Successfully deleted corrupted dummy user adminfakultas.");
  } else {
    console.log("User not found.");
  }
}

main().catch(console.error).finally(() => Prisma.$disconnect());
