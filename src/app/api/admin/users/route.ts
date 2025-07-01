import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== "doggo@dogswap.xyz") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const client = await clientPromise;
  const users = await client.db().collection("users").find({}, { projection: { name: 1, email: 1, image: 1, role: 1 } }).toArray();
  return NextResponse.json({ users });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== "doggo@dogswap.xyz") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const client = await clientPromise;
  await client.db().collection("users").deleteOne({ _id: new (await import('mongodb')).ObjectId(id) });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== "doggo@dogswap.xyz") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, name, image, role } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (role && !['admin', 'user'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ _id: new (await import('mongodb')).ObjectId(id) });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  // Prevent editing own role
  if (user.email === session.user.email) {
    return NextResponse.json({ error: 'Cannot edit yourself' }, { status: 403 });
  }
  // Prevent editing admins if not admin
  if (user.role === 'admin' && session.user.email !== 'doggo@dogswap.xyz') {
    return NextResponse.json({ error: 'Cannot edit another admin' }, { status: 403 });
  }
  const update: Record<string, unknown> = {};
  if (name) update.name = name;
  if (image) update.image = image;
  if (role) update.role = role;
  await db.collection("users").updateOne({ _id: user._id }, { $set: update });
  return NextResponse.json({ success: true });
} 