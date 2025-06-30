import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, tags, slug, body } = await req.json();
  if (!title || !slug || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection("posts").findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }
  const post = {
    title,
    tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
    slug,
    content: body,
    author: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
    date: new Date().toISOString(),
  };
  await db.collection("posts").insertOne(post);
  return NextResponse.json({ success: true });
} 