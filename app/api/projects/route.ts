import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
import { getAuthUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    const body = await req.json();

    const project = await Project.create({
      title: body.title,
      description: body.description,
      category: body.Category || body.category,
      url: body.url || "",
      projectEmoji: body.projectEmoji || "",
      status: body.status || "active",
      dueDate: body.dueDate || null,
      attachments: body.attachments || [],
      userId,
      assignedUsers: body.assignedUsers || [],
    });
    revalidatePath("/Home");
    return NextResponse.json({ success: true, id: project._id.toString() });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    const objectId = userId;

    // 👤 Projects user owns
    const ownedProjects = await Project.find({ userId: objectId })
      .lean()
      .exec();

    // 👥 Projects user is assigned in
    const assignedProjects = await Project.find({
      assignedUsers: objectId,
    })
      .lean()
      .exec();

    // merge & remove duplicates
    const projectsMap = new Map();
    [...ownedProjects, ...assignedProjects].forEach((p) =>
      projectsMap.set(p._id.toString(), p)
    );

    const projects = Array.from(projectsMap.values());

    // fetch tasks for each project
    const projectIds = projects.map((p) => p._id);

    const tasks = await Task.find({ projectId: { $in: projectIds } })
      .lean()
      .exec();

    // attach tasks to their projects
    const projectWithTasks = projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
      userId: project.userId?.toString(),
      assignedUsers: project.assignedUsers?.map((u: any) => u.toString()) || [],
      tasks: tasks
        .filter((t) => t.projectId.toString() === project._id.toString())
        .map((t) => ({
          ...t,
          _id: t._id.toString(),
          projectId: t.projectId.toString(),
          userId: t.userId?.toString() || null,
        })),
    }));

    return NextResponse.json({ success: true, data: projectWithTasks });
  } catch (error: any) {
    console.error("GET Projects Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
