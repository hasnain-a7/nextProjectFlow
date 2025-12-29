import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const body = await req.json();

    const project = await Project.findById(params.projectId);
    const task = project?.Tasks.id(params.taskId);

    Object.assign(task, body, { updatedAt: new Date() });
    await project.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: any) {
  try {
    await connectDB();

    const project = await Project.findById(params.projectId);
    project?.Tasks.id(params.taskId)?.remove();
    await project.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
