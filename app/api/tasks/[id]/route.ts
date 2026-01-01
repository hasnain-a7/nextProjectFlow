import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
import { revalidatePath } from "next/cache";
export async function POST(req: Request, ctx: any) {
  try {
    const { id } = await ctx.params; // unwrap the params
    await connectDB();

    const data = await req.json();

    // 1️⃣ Create the task in Task collection
    const task = await Task.create({
      ...data,
      createdAt: new Date(),
      projectId: id,
    });

    const project = await Project.findById(id);
    if (!project) throw new Error("Project not found");

    project.tasks.push(task._id);
    await project.save();
    revalidatePath(`/projects/${id}`);
    return NextResponse.json({
      id: task._id.toString(),
      success: true,
    });
  } catch (error: any) {
    console.error("ADD TASK ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 }
    );
  }
}
