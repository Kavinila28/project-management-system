import { z } from "zod";
import { ProjectStatus, TaskPriority, TaskStatus } from "@prisma/client";

const dateString = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid date format",
  });

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const projectSchema = z
  .object({
    projectName: z.string().trim().min(1, "Project name is required"),
    description: z.string().trim().min(1, "Description is required"),
    status: z.nativeEnum(ProjectStatus),
    startDate: dateString,
    endDate: dateString,
  })
  .superRefine((data, ctx) => {
    if (new Date(data.startDate) > new Date(data.endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be before end date",
        path: ["startDate"],
      });
    }
  });

export const taskSchema = z
  .object({
    taskName: z.string().trim().min(1, "Task name is required"),
    description: z.string().trim().min(1, "Description is required"),
    priority: z.nativeEnum(TaskPriority),
    status: z.nativeEnum(TaskStatus),
    dueDate: dateString,
    projectId: z.string().cuid("Invalid project id"),
  })
  .superRefine((data, ctx) => {
    const dueDate = new Date(data.dueDate);
    if (Number.isNaN(dueDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid due date",
        path: ["dueDate"],
      });
    }
  });
