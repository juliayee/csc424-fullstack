import { createContext, useContext, useState } from "react";
import { fakeAuth } from "../utils/FakeAuth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        //const token = await fakeAuth();
        const response = await axios.post('http://localhost:8000/account/login', { username, password });

        if (response.status == 200) {
            setToken(response.data);
            navigate("/landing");
        }
        //else alert ! 
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        username,
        password,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={{ value }}>
            {children}
        </AuthContext.Provider>
    );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);