import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
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
