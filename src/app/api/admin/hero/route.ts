import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

const SETTINGS_KEY = "hero_slides";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const doc = await db.collection("settings").findOne({ key: SETTINGS_KEY });
  return NextResponse.json({ slides: doc?.slides || null });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== "doggo@dogswap.xyz") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slides } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection("settings").updateOne(
    { key: SETTINGS_KEY },
    { $set: { slides, key: SETTINGS_KEY } },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
} 