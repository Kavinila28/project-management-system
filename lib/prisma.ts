import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Warm up the Prisma connection early to reduce first-request latency
prisma
  .$connect()
  .then(() => {
    // connected
  })
  .catch(() => {
    // ignore connect errors here; individual requests will surface them
  });

export async function withPrismaRetry<T>(
  fn: () => Promise<T>,
  attempts = 3
) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (msg.includes("prepared statement") && attempt < attempts - 1) {
        // try reconnecting to recover from prepared statement issues
        try {
          await prisma.$disconnect();
        } catch (_) {}
        try {
          await prisma.$connect();
        } catch (_) {}
        await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withPrismaRetry: exhausted attempts");
}