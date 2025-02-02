import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { register } from '../../services/api';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If the user is authenticated, redirect to the previous page or home.
  const fromPath = location.state?.from || '/home';

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      navigate(fromPath);
    }
  }, [navigate, fromPath]);

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await register({ name, email, password });
      console.log('Registration successful:', response);
      setLoading(false);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setLoading(false);
      
      // Check if the error is an axios error response and set the error message accordingly
      let message: string = 'Registration failed. Please try again.';

      if (typeof error === 'object' && error !== null && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        message = error.response.data.message as string;
      }

      setErrorMessage(message);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input value={name} onChange={handleNameChange} type="text" placeholder="Your name" id="name" name="name" />

        <label htmlFor="email">Email</label>
        <input value={email} onChange={handleEmailChange} type="email" placeholder="Your email" id="email" name="email"/>

        <label htmlFor="password">Password</label>
        <input value={password} onChange={handlePasswordChange} type="password" placeholder="Your password" id="password" name="password" />

        {errorMessage && <div className="error-message">{errorMessage}</div>}

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
