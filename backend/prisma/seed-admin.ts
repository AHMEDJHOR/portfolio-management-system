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

  const password = await rl.question("Admin password: ");

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error("An admin with this email already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  console.log("\nAdmin account created successfully:");
  console.log(admin);
} catch (error) {
  console.error(
    "\nFailed to create admin:",
    error instanceof Error ? error.message : error,
  );

  process.exitCode = 1;
} finally {
  rl.close();
  await prisma.$disconnect();
}