import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
import { revalidatePath } from "next/cache";
import { ITask } from "@/types/types";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    await connectDB();

    const { id: projectId, taskId } = params;

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: "No task ID provided" },
        { status: 400 }
      );
    }

    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided to update" },
        { status: 400 }
      );
    }

    // Find task and update all fields except _id and projectId
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    Object.keys(data).forEach((key) => {
      if (key !== "_id" && key !== "projectId") {
        task[key] = data[key];
      }
    });

    task.updatedAt = new Date();
    await task.save();

    return NextResponse.json({ success: true, data: task });
  } catch (err: any) {
    console.error("PATCH TASK ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
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
