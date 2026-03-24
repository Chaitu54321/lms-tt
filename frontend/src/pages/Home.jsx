import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library, Users, Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="page-wrapper container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '4rem 2rem', maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{ padding: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.1)' }}>
          <Library size={64} style={{ color: 'var(--primary)' }} />
        </div>
        
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to Library Management System
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            A modern, glassmorphic platform to manage your library's entire catalog, track availability, and let users discover and request books seamlessly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%', marginTop: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <BookOpen size={32} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0 }}>Browse Catalog</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Find books and check their real-time availability.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Users size={32} style={{ color: 'var(--success)' }} />
            <h3 style={{ margin: 0 }}>Mark Interest</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Show interest in books so others know what's popular.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Search size={32} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ margin: 0 }}>Request Books</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Can't find a book? Request it directly from our platform.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>Login to Account</Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
