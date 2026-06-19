import { NextRequest, NextResponse } from "next/server";
import { Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators";
import { requireUserFromRequest } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireUserFromRequest(req);
  const search = req.nextUrl.searchParams.get("search")?.trim();
  const status = req.nextUrl.searchParams.get("status") as ProjectStatus | null;

  const where: Prisma.ProjectWhereInput = { userId: user.id };
  if (search) {
    where.OR = [
      { projectName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status && ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    where.status = status;
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const user = await requireUserFromRequest(req);
  const body = await req.json();
  const parseResult = projectSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({
    data: {
      projectName: parseResult.data.projectName,
      description: parseResult.data.description,
      status: parseResult.data.status,
      startDate: new Date(parseResult.data.startDate),
      endDate: new Date(parseResult.data.endDate),
      userId: user.id,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
