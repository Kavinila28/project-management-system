import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskSchema } from "@/lib/validators";
import { requireUserFromRequest } from "@/lib/session";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await requireUserFromRequest(req);
  const task = await prisma.task.findFirst({
    where: { id, project: { userId: user.id } },
  });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await requireUserFromRequest(req);
  const body = await req.json();
  const parseResult = taskSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.task.findFirst({
    where: { id, project: { userId: user.id } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      taskName: parseResult.data.taskName,
      description: parseResult.data.description,
      priority: parseResult.data.priority,
      status: parseResult.data.status,
      dueDate: new Date(parseResult.data.dueDate),
    },
  });

  return NextResponse.json({ task });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await requireUserFromRequest(req);
  const existing = await prisma.task.findFirst({
    where: { id, project: { userId: user.id } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
