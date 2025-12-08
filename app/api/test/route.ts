import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "Test API is working!" });
}
export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ receivedData: data });
}
