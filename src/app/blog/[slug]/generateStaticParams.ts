import clientPromise from "../../../lib/mongodb";

type PostSlug = { slug: string };

export default async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db();
  const posts = await db.collection("posts").find({}, { projection: { slug: 1 } }).toArray();
  return posts.map((post) => ({ slug: (post as unknown as PostSlug).slug }));
} 