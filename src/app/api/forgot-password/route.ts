import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    
    // Check if user exists
    const user = await users.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await users.updateOne(
      { email },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry
        }
      }
    );

    // Generate the reset link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    
    console.log(`Password reset requested for ${email}. Reset token: ${resetToken}`);
    console.log(`Reset link: ${resetLink}`);

    return NextResponse.json({ 
      success: true, 
      resetLink,
      message: "Password reset link generated successfully. Check the console for the link."
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 