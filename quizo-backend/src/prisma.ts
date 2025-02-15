import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();

    await prisma.$queryRaw`SELECT 1`;

    console.log("Database connection established successfully");

    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error during database disconnect:", disconnectError);
    }

    process.exit(1);
  }
};
