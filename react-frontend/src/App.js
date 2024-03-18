import { Routes, Route, NavLink } from "react-router-dom";

import { Home } from "./Home";
import { Landing } from "./Landing";
import { Registration } from "./Registration";

import React from "react";
import { ProtectedRoute } from "./utils/ProtectedRoute.js";
import { useAuth } from "./context/AuthProvider";
import { AuthProvider } from "./context/AuthProvider";

import Cookies from 'js-cookie';
import axios from 'axios';

export const AuthContext = React.createContext(null);  // we will use this in other components

const App = () => {
  return (
    <AuthProvider>
      <Navigation />

      <h1>React Router</h1>

      <Routes>
        <Route index element={<Home />} />
        <Route path="landing" element={<ProtectedRoute><Landing /></ProtectedRoute>}/>
        <Route path="home" element={<Home />} />
        <Route path="registration" element={<Registration />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </AuthProvider>
  );
};

const Navigation = () => {
  const { value } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post('https://localhost:8000/logout', {}, {withCredentials: true});
      value.onLogout();
    } catch (error) {
      console.log("Couldn't log out.", error);
    }
  }

  return (
    <nav>
      <NavLink to="/registration">Registration</NavLink>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/landing">Landing</NavLink>
      {value.token && (
        <button type="button" onClick={handleLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};

export default App;