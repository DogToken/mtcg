'use client';
import React from "react";
import UserImage from "../components/UserImage";

// Helper function to strip markdown for previews
const stripMarkdown = (text: string): string => {
  return text
    .replace(/^### (.*$)/gim, '$1') // Remove headers
    .replace(/^## (.*$)/gim, '$1')
    .replace(/^# (.*$)/gim, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/^\s*>\s+/gm, '') // Remove blockquotes
    .replace(/\n+/g, ' ') // Replace multiple newlines with space
    .trim();
};

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

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {posts.length === 0 && (
        <div style={{ color: '#b3b8c2', fontSize: 18, textAlign: 'center' }}>No blog posts yet.</div>
      )}
      {posts.map((post) => (
        <button
          key={post._id}
          onClick={() => window.location.href = `/blog/${post.slug}`}
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
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'inherit'
          }}
        >
          <UserImage src={post.author?.image} alt={post.author?.name || "User"} size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 20 }}>{post.title}</span>
              <span style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, marginLeft: 8 }}>{post.date ? new Date(post.date).toLocaleDateString() : ""}</span>
            </div>
            <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 8 }}>
              {post.excerpt || (post.content ? stripMarkdown(post.content).slice(0, 120) + (stripMarkdown(post.content).length > 120 ? '...' : '') : '')}
            </div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{post.author?.name || "User"}</div>
          </div>
        </button>
      ))}
    </div>
  );
} 