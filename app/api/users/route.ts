import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUserId } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const userId = await getAuthUserId();

    const user = await User.findById(userId).lean();
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    const data = await req.json();

    const updated = await User.findByIdAndUpdate(
      userId,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
