import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
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
