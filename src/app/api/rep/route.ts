import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function POST(req: Request) {
  const { postId, authorEmail } = await req.json();
  
  if (!postId || !authorEmail) {
    return NextResponse.json({ error: "Missing postId or authorEmail" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    // Get or create user rep document
    const userRep = await db.collection("userRep").findOne({ email: authorEmail });
    
    if (userRep) {
      // Update existing user rep
      await db.collection("userRep").updateOne(
        { email: authorEmail },
        { 
          $inc: { repCount: 1 },
          $set: { updatedAt: new Date().toISOString() }
        }
      );
    } else {
      // Create new user rep document
      await db.collection("userRep").insertOne({
        email: authorEmail,
        repCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Store rep click record
    await db.collection("repClicks").insertOne({
      postId,
      authorEmail,
      clickedAt: new Date().toISOString(),
      sessionId: req.headers.get('x-session-id') || 'anonymous'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling rep click:', error);
    return NextResponse.json({ error: "Failed to process rep click" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const userRep = await db.collection("userRep").findOne({ email });
    return NextResponse.json({ 
      repCount: userRep?.repCount || 0,
      email 
    });
  } catch (error) {
    console.error('Error fetching user rep:', error);
    return NextResponse.json({ error: "Failed to fetch user rep" }, { status: 500 });
  }
} 