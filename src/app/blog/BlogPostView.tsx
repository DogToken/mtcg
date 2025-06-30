'use client';
import React from "react";
import UserImage from "../../components/UserImage";

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

export default function BlogPostView({ blogPost }: { blogPost: BlogPost }) {
  return (
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
  );
} 