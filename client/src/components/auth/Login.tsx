/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/api';

export const Login = () => {
  const navigate = useNavigate();
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

  const set_Email = (e: { target: { value: string } }) => {
    setEmail(e.target.value);
  };

  const set_Password = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const credentials = { email, password };
      console.log('credentials', credentials);

      const response = await login(credentials);
      console.log('Login successful:', response);
      sessionStorage.setItem('accessToken', response.AccessToken);

      localStorage.setItem('id', response.user.id);
      localStorage.setItem('name', response.user.name);
      localStorage.setItem('email', response.user.email);

      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="auth-form-container">
      <h2> Login </h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={set_Email} type="email" placeholder="your email" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input value={password} onChange={set_Password} type="password" placeholder="your password" id="password" name="password" />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button type="button" className="link-btn" onClick={() => navigate('/register')}>
          Don't have an account? Register here.
        </button>
      </form>
    </div>
  );
};
