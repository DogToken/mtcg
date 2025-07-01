import React from "react";
import Header from "../components/Header";

export default function EcosystemPage() {
  const people = [
    {
      name: 'DWMW',
      description: 'Community Web Series',
      token: 'DWMW',
      roles: 'Community Web Series',
      image: '/profile.png',
      profileUrl: '/profile/DWMW',
      readUrl: 'https://www.mintme.com/token/DWMW',
      tradeUrl: 'https://www.mintme.com/token/DWMW/trade',
    },
    {
      name: 'SatoriD',
      description: 'Creator, Games, DMT Supreme',
      token: 'SatoriD',
      roles: 'Creator, Games, DMT Supreme',
      image: '/profile.png',
      profileUrl: '/profile/SatoriD',
      readUrl: 'https://www.mintme.com/token/SatoriD',
      tradeUrl: 'https://www.mintme.com/token/SatoriD/trade',
    },
    {
      name: 'bobdubbloon',
      description: 'Podcasts, Recording, Editing, Creator',
      token: 'bobdubbloon',
      roles: 'Podcasts, Recording, Editing, Creator',
      image: '/profile.png',
      profileUrl: '/profile/bobdubbloon',
      readUrl: 'https://www.mintme.com/token/bobdubbloon',
      tradeUrl: 'https://www.mintme.com/token/bobdubbloon/trade',
    },
    {
      name: 'withinthevaccuum',
      description: 'Music, Creator, Cast and Crew',
      token: 'withinthevaccuum',
      roles: 'Music, Creator, Cast and Crew',
      image: '/profile.png',
      profileUrl: '/profile/withinthevaccuum',
      readUrl: 'https://www.mintme.com/token/withinthevaccuum',
      tradeUrl: 'https://www.mintme.com/token/withinthevaccuum/trade',
    },
    {
      name: 'Embers',
      description: 'Book Saga, Myth, Imagination',
      token: 'Embers',
      roles: 'Book Saga, Myth, Imagination',
      image: '/profile.png',
      profileUrl: '/profile/Embers',
      readUrl: 'https://www.mintme.com/token/Embers',
      tradeUrl: 'https://www.mintme.com/token/Embers/trade',
    },
    {
      name: 'Ottoken',
      description: 'Cast and Crew, Inspiration, Dreamer',
      token: 'Ottoken',
      roles: 'Cast and Crew, Inspiration, Dreamer',
      image: '/profile.png',
      profileUrl: '/profile/Ottoken',
      readUrl: 'https://www.mintme.com/token/Ottoken',
      tradeUrl: 'https://www.mintme.com/token/Ottoken/trade',
    },
    {
      name: 'Dreams',
      description: 'Community Airdrop, Building, Dreaming',
      token: 'Dreams',
      roles: 'Community Airdrop, Building, Dreaming',
      image: '/profile.png',
      profileUrl: '/profile/Dreams',
      readUrl: 'https://www.mintme.com/token/Dreams',
      tradeUrl: 'https://www.mintme.com/token/Dreams/trade',
    },
    {
      name: 'MindsGaming',
      description: 'Creator, Builder, Dreamer',
      token: 'MindsGaming',
      roles: 'Creator, Builder, Dreamer',
      image: '/profile.png',
      profileUrl: '/profile/MindsGaming',
      readUrl: 'https://www.mintme.com/token/MindsGaming',
      tradeUrl: 'https://www.mintme.com/token/MindsGaming/trade',
    },
  ];

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
        <section style={{
          background: 'rgba(34, 38, 44, 0.95)',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
          marginBottom: 32,
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Ecosystem</h2>
          <p style={{ color: '#b3b8c2', fontSize: 18, marginBottom: 28 }}>
            We are a group of friends supporting each other and content creation on <a href="https://www.mintme.com" target="_blank" rel="noopener noreferrer" style={{ color: '#5eead4', textDecoration: 'underline' }}>mintme.com</a>.<br />
            Explore our community tokens, creators, and projects below!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {people.map(person => (
              <div key={person.token} style={{
                background: 'rgba(24,28,32,0.98)',
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 2px 8px 0 rgba(0,255,255,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minHeight: 210,
                maxWidth: 520,
                width: '100%',
                margin: '0 auto',
                gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <img src={person.image} alt={person.name} style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid #5eead4', objectFit: 'cover', boxShadow: '0 0 8px #00ffff' }} />
                  <a href={person.profileUrl} style={{ color: '#fff', fontWeight: 700, fontSize: 20, textDecoration: 'underline', transition: 'color 0.2s' }}>{person.name}</a>
                </div>
                <div style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 4 }}>{person.description}</div>
                <div style={{ color: '#fff', fontSize: 15, marginBottom: 6 }}>{person.roles}</div>
                <div style={{ color: '#b3b8c2', fontSize: 15, marginBottom: 10, fontStyle: 'italic' }}>This is a short dummy description about {person.name} and their contribution to the community. More info coming soon.</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                  <a href={person.readUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#5eead4', borderRadius: 8, padding: '8px 18px', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Read</a>
                  <a href={person.tradeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#23272b', border: '1px solid #5eead4', borderRadius: 8, padding: '8px 18px', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Trade</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 