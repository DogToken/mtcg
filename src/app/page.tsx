import React from "react";
import Header from "./components/Header";

const sections = [
  {
    key: "blog",
    title: "Blog",
    description: "Community stories, updates, and more!",
    href: "/blog",
    cta: "Read blog",
  },
  {
    key: "videos",
    title: "Videos",
    description: "Community video content and highlights!",
    href: "/videos",
    cta: "Watch videos",
  },
  {
    key: "art",
    title: "Art",
    description: "Community pictures and art showcase!",
    href: "/art",
    cta: "View art",
  },
  {
    key: "info",
    title: "Info",
    description: "Community information and resources!",
    href: "/info",
    cta: "More info",
  },
  {
    key: "ecosystem",
    title: "Ecosystem",
    description: "Ethers.js integration and community ecosystem features!",
    href: "/ecosystem",
    cta: "Explore ecosystem",
  },
];

export default function Home() {
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
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(90deg, #23272b 0%, #181c20 100%)',
          borderRadius: 20,
          padding: 48,
          boxShadow: '0 2px 32px 0 rgba(0,255,255,0.08)',
          marginBottom: 48,
          textAlign: 'center',
          position: 'relative',
        }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: '-0.04em',
            textShadow: '0 0 8px #00ffff, 0 0 16px #ff00cc, 0 0 24px #39ff14',
          }}>
            Welcome to the Community Group
          </h1>
          <p style={{ fontSize: 22, color: '#b3b8c2', marginBottom: 0 }}>
            A modern, dark-themed community portal for sharing, learning, and connecting.
          </p>
        </section>
        {/* Content Previews */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 32,
        }}>
          {sections.map((section) => (
            <div key={section.key} style={{
              background: 'rgba(34, 38, 44, 0.95)',
              borderRadius: 16,
              padding: 28,
              boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minHeight: 180,
            }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>{section.title}</h2>
              <p style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 18 }}>{section.description}</p>
              <a
                href={section.href}
                className="neon-link"
              >
                {section.cta} &rarr;
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
