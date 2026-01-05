import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Task from "@/models/Tasks";
export async function GET(
  request: Request,
  { params: maybeParams }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();

    const params = await maybeParams;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid projectId" },
        { status: 400 }
      );
    }

    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Fetch tasks for this project
    const tasks = await Task.find({ projectId: project._id }).lean();

    // Sanitize function to remove Buffer / Uint8Array
    function sanitize(obj: any) {
      return {
        ...obj,
        _id: obj._id.toString(),
        userId: obj.userId?.toString(),
        assignedUsers: obj.assignedUsers?.map((u: any) => u.toString()) || [],
        attachments: obj.attachments?.map((a: any) => {
          if (a instanceof Uint8Array || Buffer.isBuffer(a)) {
            return Buffer.from(a).toString("base64");
          }
          return a;
        }),
        tasks: obj.tasks?.map((t: any) => ({
          ...t,
          _id: t._id.toString(),
          projectId: t.projectId.toString(),
          userId: t.userId?.toString() || null,
          attachments: t.attachments?.map((a: any) =>
            a instanceof Uint8Array || Buffer.isBuffer(a)
              ? Buffer.from(a).toString("base64")
              : a
          ),
        })),
      };
    }

    const projectWithTasks = sanitize({
      ...project,
      tasks,
    });

    return NextResponse.json({ success: true, data: projectWithTasks });
  } catch (err: any) {
    console.error("GET Project Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { projectId, updateData, assignedUsers, deletedUsers } = body;

    const project = await Project.findById(projectId);
    if (!project)
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );

    // Update fields
    project.title = updateData.title || project.title;
    project.description = updateData.description || project.description;
    project.category = updateData.category || project.category;
    project.status = updateData.status || project.status;
    project.dueDate = updateData.dueDate || project.dueDate;
    project.projectEmoji = updateData.projectEmoji || project.projectEmoji;
    project.attachments = updateData.attachments || project.attachments;

    // Handle assigned users
    if (assignedUsers?.length) {
      project.assignedUsers = Array.from(
        new Set([...project.assignedUsers.map(String), ...assignedUsers])
      );
    }
    if (deletedUsers?.length) {
      project.assignedUsers = project.assignedUsers.filter(
        (uid) => !deletedUsers.includes(uid.toString())
      );
    }

    await project.save();
    revalidatePath("/Home");
    return NextResponse.json({ success: true, id: project._id.toString() });
  } catch (error) {
    console.error("PATCH /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: any) {
  try {
    await connectDB();
    await Project.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
