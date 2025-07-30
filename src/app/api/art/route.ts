import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('mtcg');
  const art = await db.collection('art').find({}).sort({ _id: -1 }).toArray();
  return NextResponse.json({ art });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { url } = await req.json();
  if (!url || typeof url !== 'string' || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url)) {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db('mtcg');
  const result = await db.collection('art').insertOne({
    url,
    author: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
    date: new Date(),
  });
  return NextResponse.json({ success: true, id: result.insertedId });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const client = await clientPromise;
  const db = client.db('mtcg');
  const art = await db.collection('art').findOne({ _id: new (await import('mongodb')).ObjectId(id) });
  if (!art) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (art.author?.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await db.collection('art').deleteOne({ _id: art._id });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { id, title, description, image } = await req.json();
  if (!id || !title || !description || !image) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  
  const client = await clientPromise;
  const db = client.db('mtcg');
  
  try {
    await db.collection('art').updateOne(
      { _id: new (await import('mongodb')).ObjectId(id) },
      { 
        $set: { 
          title,
          description,
          url: image, // Map image to url field
          updatedAt: new Date().toISOString()
        } 
      }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update art" }, { status: 500 });
  }
} 