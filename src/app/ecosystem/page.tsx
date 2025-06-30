import React from "react";
import Header from "../components/Header";

export default function EcosystemPage() {
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
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
          marginBottom: 32,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Ecosystem</h2>
          <p style={{ color: '#b3b8c2', fontSize: 18 }}>Coming soon: Ethers.js integration and community ecosystem features!</p>
        </section>
      </main>
    </div>
  );
} 