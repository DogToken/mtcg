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
  // Fetch post data and site info
  const postRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/blogpost?slug=${params.post}`);
  const postData = await postRes.json();
  const siteRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/siteinfo`);
  const siteData = await siteRes.json();
  const post = postData?.post || {};
  const info = siteData?.info || {};
  return {
    title: post.title || info.title || "Blog Post | Community Group",
    description: post.description || info.description || "Community blog post.",
    openGraph: {
      title: post.title || info.title || "Blog Post | Community Group",
      description: post.description || info.description || "Community blog post.",
      images: [post.image || info.logo || '/profile.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title || info.title || "Blog Post | Community Group",
      description: post.description || info.description || "Community blog post.",
      images: [post.image || info.logo || '/profile.png'],
    },
  };
} 