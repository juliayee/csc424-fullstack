import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async () => {
        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isValidEmail = emailRegex.test(email);
            if(!isValidEmail){
                alert('Please enter a valid email, i.e.: xxx@xxx.com');
                return;
            }

            const response = await axios.post('http://localhost:8000/register', {
                username: username,
                password:password,
                confirmPassword: confirmPassword,
                email: email
            });

            console.log(response.status);
            if(response.status === 200){
                alert('Registration successful.');
                navigate('/home');
            }
            else{
                alert('Invalid password.');
            }
        }
        catch (error) {
            console.error(error.response.status);
            if (error.response.status === 400){
                alert("Enter a stronger password.");
            } else if (error.response.status === 409) {
                alert("User already exists.")
            }else {
                alert("Registration failed.");
            }
        }
    };

    return (
        <>
            <h2>User Registration</h2>

            <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div className='form-group'>
                <label htmlFor='password1'>Password</label>
                <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <div className='form-group'>
                <label htmlFor='password2'>Confirm Password</label>
                <input type='password' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>

            <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input type='text' id='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <button type='button' onClick={handleRegistration}>
                Register
            </button>
        </>
    );
};