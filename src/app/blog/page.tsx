import React from "react";
import Header from "../components/Header";
import Link from "next/link";
import Image from "next/image";
import clientPromise from "../../lib/mongodb";
import { Document } from "mongodb";

// Add BlogPost type
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date?: string;
  author?: {
    name?: string;
    image?: string;
  };
}

async function getPosts(): Promise<BlogPost[]> {
  const client = await clientPromise;
  const db = client.db();
  // Fetch all posts, newest first
  const posts = await db.collection("posts").find({}).sort({ date: -1 }).toArray();
  // Map to BlogPost type
  return posts.map((post: Document) => ({
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    author: post.author,
  }));
}

function AuthorImage({ src, alt }: { src?: string; alt: string }) {
  const [imgSrc, setImgSrc] = React.useState(src || "/profile.png");
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={64}
      height={64}
      style={{
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #5eead4',
        boxShadow: '0 0 8px #00ffff',
      }}
      priority
      onError={() => setImgSrc("/profile.png")}
    />
  );
}

export default async function BlogPage() {
  const posts: BlogPost[] = await getPosts();
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
      <main style={{ width: '100%', maxWidth: 900, padding: '0 32px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Blog</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {posts.length === 0 && (
            <div style={{ color: '#b3b8c2', fontSize: 18, textAlign: 'center' }}>No blog posts yet.</div>
          )}
          {posts.map((post: BlogPost) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              style={{
                background: 'rgba(34, 38, 44, 0.95)',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 24,
                transition: 'box-shadow 0.2s',
              }}
            >
              <AuthorImage src={post.author?.image} alt={post.author?.name || "User"} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 20 }}>{post.title}</span>
                  <span style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, marginLeft: 8 }}>{post.date ? new Date(post.date).toLocaleDateString() : ""}</span>
                </div>
                <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 8 }}>{post.excerpt || (post.content ? post.content.slice(0, 120) + (post.content && post.content.length > 120 ? '...' : '') : '')}</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{post.author?.name || "User"}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 