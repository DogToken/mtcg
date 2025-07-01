import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get('name');
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ name });
  if (!user) return NextResponse.json({ user: null }, { status: 404 });
  return NextResponse.json({ user: { name: user.name, image: user.image, email: user.email } });
} 