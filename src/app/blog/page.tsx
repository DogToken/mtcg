import React from "react";
import Header from "../components/Header";
import clientPromise from "../../lib/mongodb";
import { Document } from "mongodb";
import BlogList from "../blog/BlogList";

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
  // Fetch all posts, newest first, excluding deleted posts
  const posts = await db.collection("posts").find({ 
    deleted: { $ne: true } // Exclude posts marked as deleted
  }).sort({ date: -1 }).toArray();
  
  // Map to BlogPost type and filter out any invalid posts
  return posts
    .filter((post: Document) => post && post.title && post.slug) // Basic validation
    .map((post: Document) => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      author: post.author,
    }));
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
        <BlogList posts={posts} />
      </main>
    </div>
  );
}