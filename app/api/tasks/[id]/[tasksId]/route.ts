import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
import { revalidatePath } from "next/cache";
export async function PATCH(req: Request, ctx: any) {
  try {
    await connectDB();

    const projectId = ctx.params.id; // your project ID in URL
    const taskId = ctx.params.taskId; // your task ID in URL

    if (!taskId) throw new Error("❌ No task ID provided");

    const data = await req.json();

    // Find the task by ID
    const task = await Task.findById(taskId);
    if (!task) throw new Error("❌ Task not found");

    // Update only allowed fields to avoid overwriting _id or projectId
    const allowedFields = [
      "title",
      "todo",
      "status",
      "attachments",
      "dueDate",
      "todoEmoji",
    ];
    allowedFields.forEach((field) => {
      if (field in data) task[field] = data[field];
    });
    task.updatedAt = new Date();

    await task.save();

    // Revalidate the project page to reflect new task data
    revalidatePath(`/projects/${projectId}`);

    return NextResponse.json({ success: true, id: task._id.toString() });
  } catch (err: any) {
    console.error("UPDATE TASK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: any) {
  try {
    await connectDB();

    const project = await Project.findById(ctx.params.id);
    project?.Tasks.id(ctx.params.taskId)?.remove();
    await project.save();
    revalidatePath(`/projects/${ctx.params.id}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
