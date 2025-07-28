import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, image } = await req.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const config = db.collection('config');
  const regBlock = await config.findOne({ key: 'blockReg' });
  if (regBlock?.value) {
    return NextResponse.json({ error: "Registrations are currently blocked." }, { status: 403 });
  }
  const users = db.collection("users");
  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await users.insertOne({ email, name, password: hashedPassword, image });
  return NextResponse.json({ success: true });
} 