import { useAuth } from "./context/AuthProvider";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
  const { value } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://localhost:8000/login',
        {user: username, pass: password}, 
        {withCredentials: true});
  
      if (response.status === 200){
          value.onLogin();
      } else {
          alert('Sign in failed.');
      }
  } catch (error) {
      if (error.response.status === 401){
          alert('Wrong password.');
      } else {
          alert('Sign in failed.');
      }
  }
  };

  const handleRegistration = async () => {
    navigate('/registration');
  };

  return (
    <>
      <h2>Home (Public)</h2>

      <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
      </div>

      <div>
          <label htmlFor="password">Password </label>
          <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
      </div>

      <button type="button" onClick={handleSubmit}>
          Sign In
      </button>

      <button type="button" onClick={handleRegistration} style={{ marginLeft: '10px' }}>
          Create Account
      </button>

  </>
  );
};