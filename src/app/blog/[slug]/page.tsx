import { notFound } from "next/navigation";
import Header from "../../components/Header";
import clientPromise from "../../../lib/mongodb";

async function getPostBySlug(slug: string) {
  const client = await clientPromise;
  const db = client.db();
  const post = await db.collection("posts").findOne({ slug });
  return post;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #181c20 0%, #23272b 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 0',
    }}>
      <Header />
      <main style={{ width: '100%', maxWidth: 700, padding: '0 32px' }}>
        <article style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 36,
          boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
          marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
            <img
              src={post.author?.image || "/public/avatar1.png"}
              alt={post.author?.name || "User"}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #5eead4',
                boxShadow: '0 0 8px #00ffff',
              }}
            />
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>{post.author?.name || "User"}</div>
              <div style={{ color: '#5eead4', fontSize: 14 }}>{post.date ? new Date(post.date).toLocaleDateString() : ""}</div>
            </div>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 18 }}>{post.title}</h1>
          <div style={{ color: '#b3b8c2', fontSize: 18, lineHeight: 1.7 }}>{post.content}</div>
        </article>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db();
  type PostSlug = { slug: string };
  const posts = await db.collection("posts").find({}, { projection: { slug: 1 } }).toArray() as unknown as PostSlug[];
  return posts.map((post) => ({ slug: post.slug }));
} 