import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  const client = await clientPromise;
  const config = client.db().collection('config');
  const regBlock = await config.findOne({ key: 'blockReg' });
  return NextResponse.json({ blocked: !!regBlock?.value });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== "doggo@dogswap.xyz") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { blocked } = await req.json();
  const client = await clientPromise;
  const config = client.db().collection('config');
  await config.updateOne({ key: 'blockReg' }, { $set: { value: !!blocked } }, { upsert: true });
  return NextResponse.json({ success: true });
} 