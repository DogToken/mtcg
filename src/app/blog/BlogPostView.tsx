'use client';
import React, { useState, useEffect } from "react";
import UserImage from "../components/UserImage";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    email?: string;
  };
}

export default function BlogPostView({ blogPost }: { blogPost: BlogPost }) {
  const [hasClickedRep, setHasClickedRep] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Check if user has already clicked REP for this post
    const clickedPosts = JSON.parse(localStorage.getItem('repClickedPosts') || '[]');
    if (clickedPosts.includes(blogPost._id)) {
      setHasClickedRep(true);
    }
  }, [blogPost._id]);

  const handleRepClick = async () => {
    if (hasClickedRep || isClicking || !blogPost.author?.email) return;
    
    setIsClicking(true);
    
    try {
      const res = await fetch('/api/rep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: blogPost._id,
          authorEmail: blogPost.author.email
        })
      });
      
      if (res.ok) {
        setHasClickedRep(true);
        // Store in localStorage to prevent future clicks
        const clickedPosts = JSON.parse(localStorage.getItem('repClickedPosts') || '[]');
        clickedPosts.push(blogPost._id);
        localStorage.setItem('repClickedPosts', JSON.stringify(clickedPosts));
      }
    } catch (error) {
      console.error('Error clicking REP:', error);
    } finally {
      setIsClicking(false);
    }
  };

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
          {blogPost.author?.name ? (
            <a
              href={`/profile/${encodeURIComponent(blogPost.author.name)}`}
              style={{ color: '#5eead4', fontWeight: 600, fontSize: 17, textDecoration: 'underline', cursor: 'pointer' }}
            >
              {blogPost.author.name}
            </a>
          ) : (
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>User</div>
          )}
          <div style={{ color: '#5eead4', fontSize: 14 }}>{blogPost.date ? new Date(blogPost.date).toLocaleDateString() : ""}</div>
        </div>
        <button
          onClick={handleRepClick}
          disabled={hasClickedRep || isClicking}
          style={{
            background: hasClickedRep ? '#5eead4' : '#2a2e33',
            color: hasClickedRep ? '#181c20' : '#5eead4',
            border: '1px solid #5eead4',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 700,
            cursor: hasClickedRep || isClicking ? 'not-allowed' : 'pointer',
            fontSize: 14,
            transition: 'all 0.2s',
            opacity: hasClickedRep || isClicking ? 0.7 : 1
          }}
        >
          {isClicking ? '🔄' : hasClickedRep ? '✅ REP' : '⭐ REP'}
        </button>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 18 }}>{blogPost.title}</h1>
      <div style={{ color: '#b3b8c2', fontSize: 18, lineHeight: 1.7 }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 16, marginTop: 24, color: '#fff'}}>{children}</h1>,
            h2: ({children}) => <h2 style={{fontSize: 24, fontWeight: 600, marginBottom: 14, marginTop: 20, color: '#fff'}}>{children}</h2>,
            h3: ({children}) => <h3 style={{fontSize: 20, fontWeight: 600, marginBottom: 12, marginTop: 18, color: '#fff'}}>{children}</h3>,
            h4: ({children}) => <h4 style={{fontSize: 18, fontWeight: 600, marginBottom: 10, marginTop: 16, color: '#fff'}}>{children}</h4>,
            p: ({children}) => <p style={{marginBottom: 16, color: '#b3b8c2'}}>{children}</p>,
            strong: ({children}) => <strong style={{color: '#fff', fontWeight: 600}}>{children}</strong>,
            em: ({children}) => <em style={{color: '#5eead4', fontStyle: 'italic'}}>{children}</em>,
            code: ({children}) => <code style={{background: '#2a2e33', padding: '3px 6px', borderRadius: 4, fontSize: 16, color: '#5eead4', fontFamily: 'monospace'}}>{children}</code>,
            pre: ({children}) => <pre style={{background: '#2a2e33', padding: 16, borderRadius: 8, overflowX: 'auto', marginBottom: 16, fontSize: 14, color: '#5eead4', fontFamily: 'monospace'}}>{children}</pre>,
            blockquote: ({children}) => <blockquote style={{borderLeft: '4px solid #5eead4', paddingLeft: 20, marginBottom: 16, color: '#b3b8c2', fontStyle: 'italic'}}>{children}</blockquote>,
            ul: ({children}) => <ul style={{marginBottom: 16, paddingLeft: 24, color: '#b3b8c2'}}>{children}</ul>,
            ol: ({children}) => <ol style={{marginBottom: 16, paddingLeft: 24, color: '#b3b8c2'}}>{children}</ol>,
            li: ({children}) => <li style={{marginBottom: 6, color: '#b3b8c2'}}>{children}</li>,
            a: ({children, href}) => <a href={href} style={{color: '#5eead4', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer">{children}</a>,
            table: ({children}) => <table style={{borderCollapse: 'collapse', width: '100%', marginBottom: 16}}>{children}</table>,
            th: ({children}) => <th style={{border: '1px solid #2a2e33', padding: '8px 12px', textAlign: 'left', background: '#2a2e33', color: '#fff', fontWeight: 600}}>{children}</th>,
            td: ({children}) => <td style={{border: '1px solid #2a2e33', padding: '8px 12px', color: '#b3b8c2'}}>{children}</td>,
            hr: () => <hr style={{border: 'none', borderTop: '1px solid #2a2e33', margin: '24px 0'}} />,
          }}
        >
          {blogPost.content || ''}
        </ReactMarkdown>
      </div>
    </article>
  );
} 