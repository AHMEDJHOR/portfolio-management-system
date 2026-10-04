import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { prisma } from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/password.js";

const rl = createInterface({ input, output });

try {
  const email = (
    await rl.question("Admin email: ")
  ).trim().toLowerCase();

  const newPassword = await rl.question("New admin password: ");

  if (!email || !newPassword) {
    throw new Error("Email and password are required.");
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    throw new Error("No admin account found with this email.");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.admin.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  console.log(`\nAdmin password reset successfully for: ${email}`);
} catch (error) {
  console.error(
    "\nFailed to reset admin password:",
    error instanceof Error ? error.message : error,
  );

  process.exitCode = 1;
} finally {
  rl.close();
  await prisma.$disconnect();
}