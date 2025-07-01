import { notFound } from "next/navigation";
import Header from "../../components/Header";
import clientPromise from "../../../lib/mongodb";
import BlogPostView from "../BlogPostView";
import { Metadata } from "next";

async function getPostByPost(post: string) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("posts").findOne({ slug: post });
  return result;
}

export default async function BlogPostPage({ params }: { params: { post: string } }) {
  const { post } = params;
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

export async function generateMetadata({ params }: { params: { post: string } }): Promise<Metadata> {
  const client = await clientPromise;
  const db = client.db();
  const post = await db.collection("posts").findOne({ slug: params.post });
  const title = post?.title || "Blog Post | Community Group";
  const description = post?.description || "Community blog post.";
  const image = post?.image || "/profile.png";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
} 