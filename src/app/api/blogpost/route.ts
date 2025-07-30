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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const authorEmail = url.searchParams.get('authorEmail');
  const client = await clientPromise;
  const db = client.db();
  if (!authorEmail) {
    // Return latest 5 posts for homepage
    const posts = await db.collection("posts").find({ 
      deleted: { $ne: true } // Exclude deleted posts
    }).sort({ _id: -1 }).limit(5).toArray();
    return NextResponse.json({ posts });
  }
  const posts = await db.collection("posts").find({ 
    "author.email": authorEmail,
    deleted: { $ne: true } // Exclude deleted posts
  }).sort({ date: -1 }).toArray();
  return NextResponse.json({ posts });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  
  // Use soft delete instead of hard delete
  await db.collection("posts").updateOne(
    { _id: new (await import('mongodb')).ObjectId(id) },
    { 
      $set: { 
        deleted: true,
        deletedAt: new Date().toISOString()
      } 
    }
  );
  return NextResponse.json({ success: true });
} 