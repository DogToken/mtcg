import { notFound } from "next/navigation";
import Header from "../../components/Header";
import clientPromise from "../../../lib/mongodb";
import BlogPostView from "../BlogPostView";

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
        <BlogPostView blogPost={JSON.parse(JSON.stringify(blogPost))} />
      </main>
    </div>
  );
}