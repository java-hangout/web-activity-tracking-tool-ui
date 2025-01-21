// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(null);

    const login = (token) => {
        setAuthState({ token });
        localStorage.setItem('token', token); // Save token to localStorage
    };

    const logout = () => {
        setAuthState(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
