import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="navbar-brand" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <BookOpen size={24} color="#a855f7" /> Chaitzzz Books
      </Link>
      <div className="navbar-nav">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
              <LogIn size={18} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{padding: '0.5rem 1rem'}}>
              <UserPlus size={18} /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
