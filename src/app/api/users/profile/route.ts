import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, image } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const update: Record<string, unknown> = {};
  if (name) update.name = name;
  if (image) update.image = image;
  await db.collection("users").updateOne({ email: session.user.email }, { $set: update });
  return NextResponse.json({ success: true });
} 