import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="glass-panel animate-fade-in" style={{maxWidth: '400px', width: '100%', padding: '2.5rem 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h2>Welcome Back</h2>
          <p style={{color: 'var(--text-secondary)'}}>Login to access your books.</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="form-input" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="form-input" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}} disabled={loading}>
            <LogIn size={18} /> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem'}}>
          <span style={{color: 'var(--text-secondary)'}}>Don't have an account? </span>
          <Link to="/register" style={{color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500'}}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
