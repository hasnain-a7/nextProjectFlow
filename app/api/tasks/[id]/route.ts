import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function POST(req: Request, { params }: any) {
  try {
    await connectDB();
    const data = await req.json();

    const project = await Project.findById(params.projectId);
    if (!project) throw new Error("Project not found");

    project.Tasks.push({ ...data, createdAt: new Date() });
    await project.save();

    return NextResponse.json({
      id: project.Tasks[project.Tasks.length - 1]._id.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
