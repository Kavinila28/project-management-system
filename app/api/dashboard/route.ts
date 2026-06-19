import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserFromRequest } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireUserFromRequest(req);

  const [totalProjects, totalTasks, completedTasks, pendingTasks, projectsInProgress] = await Promise.all([
    prisma.project.count({ where: { userId: user.id } }),
    prisma.task.count({ where: { project: { userId: user.id } } }),
    prisma.task.count({ where: { project: { userId: user.id }, status: "COMPLETED" } }),
    prisma.task.count({ where: { project: { userId: user.id }, status: "PENDING" } }),
    prisma.project.count({ where: { userId: user.id, status: "IN_PROGRESS" } }),
  ]);

  return NextResponse.json({
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    projectsInProgress,
  });
}
