import { useAuth } from "./context/AuthProvider";
import { createContext, useContext, useState } from "react";

export const Home = () => {
  const { value } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const logins = [
    { username: 'user1', password: 'pass1' },
    { username: 'bj', password: 'pass424' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === logins.username && password === logins.password) {
      value.username = username;
      value.password = password;
      value.onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <form>
      <h2>Home (Public)</h2>
      <button type="button" onClick={handleSubmit}>
        Sign In
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </form>
  );
};