import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData.firstname, formData.lastname, formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div className="glass-panel animate-fade-in" style={{maxWidth: '450px', width: '100%', padding: '2.5rem 2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h2>Create Account</h2>
          <p style={{color: 'var(--text-secondary)'}}>Join us to manage your books.</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group" style={{flex: 1, marginBottom: 0}}>
              <label className="form-label" htmlFor="firstname">First Name</label>
              <input type="text" id="firstname" name="firstname" className="form-input" value={formData.firstname} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{flex: 1, marginBottom: 0}}>
              <label className="form-label" htmlFor="lastname">Last Name</label>
              <input type="text" id="lastname" name="lastname" className="form-input" value={formData.lastname} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input type="text" id="username" name="username" className="form-input" value={formData.username} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input type="password" id="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}} disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem'}}>
          <span style={{color: 'var(--text-secondary)'}}>Already have an account? </span>
          <Link to="/login" style={{color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500'}}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
