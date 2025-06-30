import React from "react";
import Header from "../../components/Header";
import { notFound } from "next/navigation";

// Demo blog post data (should match blog/page.tsx)
const posts = [
  {
    slug: "first-post",
    title: "Welcome to the Community Blog!",
    content: "This is our very first post. Stay tuned for more updates and stories from the community. We are excited to have you here!",
    date: "2024-06-01",
    author: {
      name: "Alice",
      image: "/public/avatar1.png",
    },
  },
  {
    slug: "web3-tips",
    title: "Top 5 Web3 Tips for Beginners",
    content: "Get started with Web3 and blockchain with these essential tips from our community experts. 1. Use a secure wallet. 2. Never share your seed phrase. 3. Double-check contract addresses. 4. Join our Discord for help. 5. Stay curious!",
    date: "2024-06-02",
    author: {
      name: "Bob",
      image: "/public/avatar2.png",
    },
  },
  {
    slug: "community-art",
    title: "Showcasing Community Art",
    content: "A look at some of the amazing art created by our talented members. Submit your own work to be featured in future posts!",
    date: "2024-06-03",
    author: {
      name: "Charlie",
      image: "/public/avatar3.png",
    },
  },
];

export interface PageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = posts.find((p) => p.slug === params.slug);
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
              src={post.author.image}
              alt={post.author.name}
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
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>{post.author.name}</div>
              <div style={{ color: '#5eead4', fontSize: 14 }}>{new Date(post.date).toLocaleDateString()}</div>
            </div>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 18 }}>{post.title}</h1>
          <div style={{ color: '#b3b8c2', fontSize: 18, lineHeight: 1.7 }}>{post.content}</div>
        </article>
      </main>
    </div>
  );
} 