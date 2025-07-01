"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";

function SectionCard({ children, style }: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <section style={{
      background: 'rgba(34, 38, 44, 0.95)',
      borderRadius: 16,
      padding: 32,
      boxShadow: '0 2px 16px 0 rgba(0,255,255,0.06)',
      marginBottom: 32,
      ...style,
    }}>
      {children}
    </section>
  );
}

const defaultWelcome = `<h2 style='font-size:28px;font-weight:700;margin-bottom:16px'>Ecosystem</h2><p style='color:#b3b8c2;font-size:18px;margin-bottom:28px'>We are a group of friends supporting each other and content creation on <a href="https://www.mintme.com" target="_blank" rel="noopener noreferrer" style="color:#5eead4;text-decoration:underline">mintme.com</a>.<br />Explore our community tokens, creators, and projects below!</p>`;
const defaultEngagement = `<ul style='color:#b3b8c2;font-size:17px;line-height:1.7;margin:0 0 0 18px'><li>Join or start a sub-group or club</li><li>Participate in monthly challenges or contests</li><li>Volunteer for events or projects</li><li>Contribute to blog, art, or video sections</li><li>Attend upcoming events</li></ul>`;
const defaultResources = `<ul style='color:#b3b8c2;font-size:17px;line-height:1.7;margin:0 0 0 18px'><li><a href='/info' style='color:#5eead4'>Community Guidelines</a></li><li><a href='/register' style='color:#5eead4'>Onboarding Guide</a></li><li><a href='/faq' style='color:#5eead4'>FAQ / Help Center</a></li><li><a href='/dashboard/admin' style='color:#5eead4'>Admin Directory</a></li><li><a href='/blog' style='color:#5eead4'>Event Calendar</a></li></ul>`;

export default function EcosystemPage() {
  const [welcome, setWelcome] = useState<string | null>(null);
  const [engagement, setEngagement] = useState<string | null>(null);
  const [resources, setResources] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/ecosystem-welcome').then(res => res.json()).then(data => setWelcome(data.content));
    fetch('/api/admin/ecosystem-engagement').then(res => res.json()).then(data => setEngagement(data.content));
    fetch('/api/admin/ecosystem-resources').then(res => res.json()).then(data => setResources(data.content));
  }, []);

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
        {/* Welcome Section */}
        <SectionCard style={{ marginBottom: 32 }}>
          <div dangerouslySetInnerHTML={{ __html: welcome || defaultWelcome }} />
        </SectionCard>
        {/* Engagement Section */}
        <SectionCard style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>Get Involved</div>
          <div dangerouslySetInnerHTML={{ __html: engagement || defaultEngagement }} />
        </SectionCard>
        {/* Profiles Section */}
        <SectionCard style={{ background: 'rgba(34, 38, 44, 0.95)', marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {people.map(person => (
              <div key={person.token} style={{
                background: 'rgba(24,28,32,0.98)',
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 2px 8px 0 rgba(0,255,255,0.04)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 120,
                maxWidth: 800,
                width: '100%',
                margin: '0 auto',
                gap: 24,
              }}>
                <img src={person.image} alt={person.name} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #5eead4', objectFit: 'cover', boxShadow: '0 0 8px #00ffff', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 2 }}>{person.name}</div>
                  <div style={{ color: '#b3b8c2', fontSize: 16 }}>{person.description}</div>
                  <div style={{ color: '#5eead4', fontSize: 15, fontWeight: 600 }}>{person.roles}</div>
                  <div style={{ color: '#b3b8c2', fontSize: 15, fontStyle: 'italic', marginTop: 2 }}>This is a short dummy description about {person.name} and their contribution to the community. More info coming soon.</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                  <a href={person.profileUrl} style={{ color: '#fff', background: '#23272b', border: '1px solid #5eead4', borderRadius: 8, padding: '8px 18px', fontWeight: 700, textDecoration: 'none', fontSize: 15, marginBottom: 6 }}>Profile</a>
                  <a href={person.readUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#5eead4', borderRadius: 8, padding: '8px 18px', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Read</a>
                  <a href={person.tradeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: '#23272b', border: '1px solid #5eead4', borderRadius: 8, padding: '8px 18px', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Trade</a>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        {/* Resource Hub Section */}
        <SectionCard style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 10 }}>Community Resources</div>
          <div dangerouslySetInnerHTML={{ __html: resources || defaultResources }} />
        </SectionCard>
      </main>
    </div>
  );
} 