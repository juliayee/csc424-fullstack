import { Routes, Route, Link, NavLink } from "react-router-dom";
import { Home } from "./Home";
import { Landing } from "./Landing";
import { Registration } from "./Registration";
import React, { useState } from "react";
import { ProtectedRoute } from "./utils/ProtectedRoute.js";
import { fakeAuth } from "./utils/FakeAuth.js";
import { useAuth } from "./context/AuthProvider";
import { AuthProvider } from "./context/AuthProvider";
import Cookies from 'js-cookie';
import axios from 'axios';

export const AuthContext = React.createContext(null);  // we will use this in other components

const App = () => {
  const [token, setToken] = React.useState(null);
  const [user, setUser] = React.useState(null);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/account/login', {
        username,
        password,
      });

      const { token } = response.data;

      console.log('Login successful. Token:', token);
    }
    catch (error) {
      console.error('Login failed:', error.response.data.error);
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  const authenticateUser = async (credentials) => {
    try {
      const response = await fetch('/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      const receivedToken = data.token;
      Cookies.set('token', receivedToken, { expires: 7, secure: true });

    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <AuthProvider>
      <Navigation />
      <h1>React Router</h1>
      <Routes>
        <Route index element={<Home />} />
        <Route
          path="landing"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
        <Route path="home" element={<Home />} />
        <Route path="registration" element={<Registration />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </AuthProvider>
  );
};

const Navigation = () => {
  const { value } = useAuth();
  return (
    <nav>
      <NavLink to="/registration">Registration</NavLink>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/landing">Landing</NavLink>
      {value.token && (
        <button type="button" onClick={value.onLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};

const axios = require('axios');

// Registration
axios.post('http://localhost:3000/register', { name: 'user', job: 'developer', password: 'password' })
  .then(response => {
    console.log(response.data);
    //store token locally
    const { token } = response.data;
    localStorage.setItem('token', token);
    console.log(response.data);
  })
  .catch(error => console.error(error.response.data));

// Login
axios.post('http://localhost:3000/login', { name: 'user', password: 'password' })
  .then(response => {
    console.log(response.data);
    //store token locally
    const { token } = response.data;
    localStorage.setItem('token', token);
    console.log(response.data);
  })
  .catch(error => console.error(error.response.data));

// Logout
axios.post('http://localhost:3000/logout')
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));

export default App;