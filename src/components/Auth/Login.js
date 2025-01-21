// src/components/Auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate for redirecting
import { AuthContext } from '../../context/AuthContext'; // Correct import
import './Login.css'; // Import external CSS

const Login = () => {
    const { login } = useContext(AuthContext); // Access login function from context
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use navigate hook for redirecting

    const handleLogin = async () => {
        try {
            const userResponse = await fetch(`http://localhost:8081/api/users/fetch/username/${credentials.username}`);

            if (!userResponse.ok) {
                setError('Failed to fetch user details.');
                return;
            }

            const userData = await userResponse.json();
            const userRole = userData.role;

            // Store role in localStorage
            localStorage.setItem('role', userRole);

            const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...credentials,
                    role: userRole,
                }),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                console.error('Login error response:', errorData);
                setError(errorData.message || 'Invalid username or password');
                return;
            }

            const loginData = await loginResponse.json();

            if (loginData.token) {
                login(loginData.token); // Use the login function from context
                localStorage.setItem('username', credentials.username);
                localStorage.setItem('token', loginData.token);
                navigate('/dashboard'); // Redirect after successful login
            } else {
                setError('Login failed. Token not received.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('Failed to login. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-header">Web Activity Tracking Tool Login</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                </div>
                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
