import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext'; // Ensure this import is correct
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
    // Access context
    const context = useContext(AuthContext);

    // Ensure context is available and authState exists
    if (!context || !context.authState) {
        return <div>Loading...</div>; // Or any fallback UI, in case context is not ready
    }

    const { authState } = context;

    return (
        <Router>
            <Routes>
                {/* Default route for login or authenticated dashboard */}
                <Route
                    path="/"
                    element={authState?.token ? <Dashboard /> : <Login />}
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
