'use client';
import React, { useEffect, useState } from "react";

export interface FooterContent {
  about: string;
  links: { label: string; href: string }[];
  socials: { label: string; href: string }[];
}

const defaultContent: FooterContent = {
  about: "A modern, open community for sharing, learning, and connecting. Join us on our journey!",
  links: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Videos", href: "/videos" },
    { label: "Art", href: "/art" },
    { label: "Info", href: "/info" },
    { label: "Ecosystem", href: "/ecosystem" },
  ],
  socials: [
    { label: "Twitter", href: "https://twitter.com/" },
    { label: "Discord", href: "https://discord.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
};

export default function Footer() {
  const [content, setContent] = useState<FooterContent>(defaultContent);
  useEffect(() => {
    fetch('/api/admin/footer').then(res => res.json()).then(data => {
      if (data.content) setContent(data.content);
    });
  }, []);
  return (
    <footer style={{
      width: '100%',
      background: 'linear-gradient(90deg, #23272b 0%, #181c20 100%)',
      color: '#b3b8c2',
      padding: '40px 0 24px 0',
      borderTop: '1px solid #2a2e33',
      marginTop: 48,
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 48,
        flexWrap: 'wrap',
        padding: '0 32px',
      }}>
        {/* About */}
        <div style={{ flex: 2, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>About</div>
          <div style={{ fontSize: 16, lineHeight: 1.6 }}>{content.about}</div>
        </div>
        {/* Quick Links */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 10 }}>Quick Links</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {content.links.map(link => (
              <li key={link.href} style={{ marginBottom: 8 }}>
                <a href={link.href} style={{ color: '#5eead4', textDecoration: 'none', fontSize: 16 }}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        {/* Socials */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 10 }}>Socials</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {content.socials.map(social => (
              <li key={social.href} style={{ marginBottom: 8 }}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" style={{ color: '#5eead4', textDecoration: 'none', fontSize: 16 }}>{social.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#b3b8c2', fontSize: 15, marginTop: 32, opacity: 0.7 }}>
        &copy; {new Date().getFullYear()} Community Group. All rights reserved.
      </div>
    </footer>
  );
} 