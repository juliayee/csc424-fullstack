import React, { useState } from 'react';
import axios from 'axios';

export const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrengthMessage, setPasswordStrengthMessage] = useState('');

    const handleRegistration = async () => {
        try {
            // Implement password strength validation on the frontend here
            if (!isPasswordStrong(password)) {
                // Display a message to the user indicating that the password is not strong enough
                setPasswordStrengthMessage('Password should contain at least one capital letter, one number, and one symbol.');
                return;
            }

            const response = await axios.post('http://localhost:8000/account/register', {
                username,
                password,
                confirmPassword,
            });

            console.log('Registration successful:', response.data.message);
        }
        catch (error) {
            console.error('Registration failed:', error.response.data.error);
        }
    };

    const isPasswordStrong = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    return (
        <div>
            <h2>User Registration</h2>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <label>
                Confirm Password:
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </label>
            <br />
            <button onClick={handleRegistration}>Register</button>
        </div>
    );
};