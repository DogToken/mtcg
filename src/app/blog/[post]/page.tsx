import { notFound } from "next/navigation";
import Header from "../../components/Header";
import clientPromise from "../../../lib/mongodb";
import UserImage from "../../components/UserImage";

async function getPostByPost(post: string) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("posts").findOne({ slug: post });
  return result;
}

export default async function BlogPostPage({ params }: { params: Promise<{ post: string }> }) {
  const { post } = await params;
  const blogPost = await getPostByPost(post);
  if (!blogPost) return notFound();

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
            <UserImage src={blogPost.author?.image} alt={blogPost.author?.name || "User"} size={56} />
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>{blogPost.author?.name || "User"}</div>
              <div style={{ color: '#5eead4', fontSize: 14 }}>{blogPost.date ? new Date(blogPost.date).toLocaleDateString() : ""}</div>
            </div>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 18 }}>{blogPost.title}</h1>
          <div style={{ color: '#b3b8c2', fontSize: 18, lineHeight: 1.7 }}>{blogPost.content}</div>
        </article>
      </main>
    </div>
  );
} 