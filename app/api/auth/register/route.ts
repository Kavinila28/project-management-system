import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuthToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { allowRequest, getClientIp } from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!allowRequest(ip, "register")) {
    return NextResponse.json(
      { error: "Too many registration attempts, please wait." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parseResult = registerSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { fullName, email, password } = parseResult.data;
  // attempt db lookup with transient-retry (prepared statement issues)
  let existingUser = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
      break;
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (msg.includes("prepared statement") && attempt < 2) {
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

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  let user = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      user = await prisma.user.create({
        data: { fullName, email, password: hashedPassword },
      });
      break;
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (msg.includes("prepared statement") && attempt < 2) {
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

  const token = createAuthToken({
    sub: user.id,
    email: user.email,
    name: user.fullName,
  });

  const response = NextResponse.json({
    user: { id: user.id, fullName: user.fullName, email: user.email },
  });
  setAuthCookie(response, token);
  return response;
}
