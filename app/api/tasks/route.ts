import { NextRequest, NextResponse } from "next/server";
import { Prisma, TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validators";
import { requireUserFromRequest } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireUserFromRequest(req);
  const search = req.nextUrl.searchParams.get("search")?.trim();
  const status = req.nextUrl.searchParams.get("status") as TaskStatus | null;
  const priority = req.nextUrl.searchParams.get("priority") as TaskPriority | null;

  const where: Prisma.TaskWhereInput = { project: { userId: user.id } };
  if (search) {
    where.OR = [
      { taskName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status && ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    where.status = status;
  }
  if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority)) {
    where.priority = priority;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { project: true },
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const user = await requireUserFromRequest(req);
  const body = await req.json();
  const parseResult = taskSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const project = await prisma.project.findFirst({
    where: { id: parseResult.data.projectId, userId: user.id },
  });
  if (!project) {
    return NextResponse.json(
      { error: "Project not found or not authorized" },
      { status: 404 }
    );
  }

  const task = await prisma.task.create({
    data: {
      taskName: parseResult.data.taskName,
      description: parseResult.data.description,
      priority: parseResult.data.priority,
      status: parseResult.data.status,
      dueDate: new Date(parseResult.data.dueDate),
      projectId: parseResult.data.projectId,
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
