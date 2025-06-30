import React from "react";
import Header from "../components/Header";
import Link from "next/link";
import Image from "next/image";

// Demo blog post data
const posts = [
  {
    slug: "first-post",
    title: "Welcome to the Community Blog!",
    excerpt: "This is our very first post. Stay tuned for more updates and stories from the community.",
    date: "2024-06-01",
    author: {
      name: "Alice",
      image: "/public/avatar1.png",
    },
  },
  {
    slug: "web3-tips",
    title: "Top 5 Web3 Tips for Beginners",
    excerpt: "Get started with Web3 and blockchain with these essential tips from our community experts.",
    date: "2024-06-02",
    author: {
      name: "Bob",
      image: "/public/avatar2.png",
    },
  },
  {
    slug: "community-art",
    title: "Showcasing Community Art",
    excerpt: "A look at some of the amazing art created by our talented members.",
    date: "2024-06-03",
    author: {
      name: "Charlie",
      image: "/public/avatar3.png",
    },
  },
];

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export default function BlogPage({ params }: BlogPostPageProps) {
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
          {posts.map((post) => (
            <Link
              key={post.slug}
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
              <Image
                src={post.author.image}
                alt={post.author.name}
                width={64}
                height={64}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #5eead4',
                  boxShadow: '0 0 8px #00ffff',
                }}
                priority
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 20 }}>{post.title}</span>
                  <span style={{ color: '#5eead4', fontSize: 14, fontWeight: 500, marginLeft: 8 }}>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 8 }}>{post.excerpt}</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{post.author.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 