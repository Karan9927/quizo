import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma = global.prisma ?? prismaClientSingleton();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection established");

    return prisma;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
