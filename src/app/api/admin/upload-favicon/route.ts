import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { promises as fs } from "fs";
import path from "path";
// @ts-expect-error: No types for formidable in Next.js route handlers, but works at runtime
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse form data
  const form = new IncomingForm();
  const data = await new Promise<{ fields: unknown; files: unknown }>((resolve, reject) => {
    form.parse(req, (err: unknown, fields: unknown, files: unknown) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
  const files = data.files as Record<string, unknown>;
  const file = files.file as { originalFilename: string; filepath: string };
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const ext = path.extname(file.originalFilename).toLowerCase();
  const allowed = [".ico", ".png"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  const filename = `favicon${ext}`;
  const destPath = path.join(process.cwd(), "public", filename);
  await fs.copyFile(file.filepath, destPath);
  return NextResponse.json({ path: `/${filename}` });
} 