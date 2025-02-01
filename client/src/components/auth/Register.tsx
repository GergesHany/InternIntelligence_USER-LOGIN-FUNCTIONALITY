/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { register } from '../../services/api';

export const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const from = location.state?.from || { pathname: '/home' };

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      navigate(from);
    }
  }, [navigate, from]);

  const set_Name = (e: { target: { value: string } }) => {
    setName(e.target.value);
  };

  const set_Email = (e: { target: { value: string } }) => {
    setEmail(e.target.value);
  };

  const set_Password = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await register(userData);
      console.log('Registration successful:', response);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="firstName">Name</label>
        <input value={name} onChange={set_Name} type="text" placeholder="your name" id="Name" name="name" />

        <label htmlFor="email">Email</label>
        <input value={email} onChange={set_Email} type="email" placeholder="your email" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input value={password} onChange={set_Password} type="password" placeholder="your password" id="password" name="password" />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <button type="button" className="link-btn" onClick={() => navigate('/login')}>
          Already have an account? Login here.
        </button>
      </form>
    </div>
  );
};
