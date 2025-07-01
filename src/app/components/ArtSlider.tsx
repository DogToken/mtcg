'use client';
import React, { useState, useRef } from 'react';

interface ArtItem {
  _id: string;
  url: string;
}

export default function ArtSlider({ art }: { art: ArtItem[] }) {
  const [active, setActive] = useState(0);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDotClick = (idx: number) => {
    setActive(idx);
    sliderRef.current?.scrollTo({ left: idx * 340, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const idx = Math.round(sliderRef.current.scrollLeft / 340);
    setActive(idx);
  };

  return (
    <div>
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: 24,
          paddingBottom: 8,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {art.map((item, idx) => (
          <div
            key={item._id}
            style={{
              minWidth: 320,
              maxWidth: 340,
              flex: '0 0 340px',
              background: 'rgba(34, 38, 44, 0.95)',
              borderRadius: 16,
              padding: 18,
              boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
              scrollSnapAlign: 'start',
              border: active === idx ? '2px solid #5eead4' : '2px solid transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => setModalImg(item.url)}
          >
            <img
              src={item.url}
              alt="Art"
              width={280}
              height={180}
              style={{ borderRadius: 10, marginBottom: 8, objectFit: 'cover', width: 280, height: 180, background: '#23272b', border: '2px solid #5eead4', boxShadow: '0 0 8px #00ffff' }}
              onError={e => (e.currentTarget.src = '/profile.png')}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12 }}>
        {art.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: 'none',
              background: active === idx ? '#5eead4' : '#2a2e33',
              boxShadow: active === idx ? '0 0 8px #00ffff' : 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              outline: 'none',
              margin: 0,
              padding: 0,
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      {modalImg && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setModalImg(null)}
        >
          <img
            src={modalImg}
            alt="Art Large"
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              borderRadius: 16,
              border: '3px solid #5eead4',
              boxShadow: '0 0 32px #00ffff',
              background: '#23272b',
            }}
            onClick={e => e.stopPropagation()}
            onError={e => (e.currentTarget.src = '/profile.png')}
          />
        </div>
      )}
    </div>
  );
} 