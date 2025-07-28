'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.replace('/login');
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #181c20 0%, #23272b 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Page Not Available</h2>
        <p style={{ color: '#b3b8c2', fontSize: 16, marginBottom: 24 }}>
          Password reset requests are now handled by administrators only.
        </p>
        <p style={{ color: '#5eead4', fontSize: 14 }}>
          Please contact an administrator for password reset assistance.
        </p>
      </div>
    </div>
  );
} 