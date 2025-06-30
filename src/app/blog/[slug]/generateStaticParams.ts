import clientPromise from "../../../lib/mongodb";

export default async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db();
  const posts = await db.collection("posts").find({}, { projection: { slug: 1 } }).toArray();
  return posts.map((post: any) => ({ slug: post.slug }));
} 