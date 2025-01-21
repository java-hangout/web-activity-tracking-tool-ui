import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ApiContext = createContext();

const ApiProvider = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    const api = axios.create({
        baseURL: 'http://localhost:8083', // Base URL for all services
        headers: {
            Authorization: authToken ? `Bearer ${authToken}` : '', // Only add token if it exists
        },
    });

    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export default ApiProvider;
