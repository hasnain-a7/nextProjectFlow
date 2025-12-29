import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getAuthUserId } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const userId = await getAuthUserId();

    const owned = await Project.find({ userId }).lean();
    const assigned = await Project.find({ assignedUsers: userId }).lean();

    const combined = [
      ...owned,
      ...assigned.filter(
        (p) => !owned.some((op) => op._id.toString() === p._id.toString())
      ),
    ];

    return NextResponse.json(combined);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const project = await Project.create({
      ...body,
    });

    return NextResponse.json({ id: project._id.toString() });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
