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
  const users = await client.db().collection("users").find({}, { projection: { name: 1, email: 1, image: 1 } }).toArray();
  return NextResponse.json({ users });
} 