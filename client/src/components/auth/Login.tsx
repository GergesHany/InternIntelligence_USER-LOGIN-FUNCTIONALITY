import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  

  const location = useLocation();
  const fromPath = location.state?.from?.pathname || '/home';

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      navigate(fromPath);
    }
  }, [navigate, fromPath]);

  const setEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const setPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const credentials = { email, password };
      console.log('credentials', credentials);

      const response = await login(credentials);

      if (!response.AccessToken) {
        throw new Error('Invalid login credentials');
      }

      sessionStorage.setItem('accessToken', response.AccessToken);
      sessionStorage.setItem('userId', response.user.id);
      sessionStorage.setItem('userName', response.user.name);
      sessionStorage.setItem('userEmail', response.user.email);

      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2> Login </h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input value={email} onChange={setEmailHandler} type="email" placeholder="your email" id="email" name="email" />

        <label htmlFor="password">Password</label>
        <input value={password} onChange={setPasswordHandler} type="password" placeholder="your password" id="password" name="password" />

        {errorMessage && <div className="error-message">{errorMessage}</div>}

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
