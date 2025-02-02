import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    // remove the token from the session storage
    sessionStorage.removeItem('accessToken');

    navigate('/login');
  };

  const Name: string = sessionStorage.getItem('userName') || '';

  return (
    <div>
      <button className="log_out" onClick={handleLogOut}>
        Logout
      </button>
      <h2> Welcome {Name} to the Home Page </h2>
      <p>You are now logged in</p>
    </div>
  );
};
