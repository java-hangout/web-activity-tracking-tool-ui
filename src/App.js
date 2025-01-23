// src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PieChartPage from "./components/Report/PieChartPage"; // Import PieChartPage

const App = () => {
    const { authState } = useContext(AuthContext); // Access context

    return (
        <Router>
            <Routes>
                {/* Static route for login or authenticated dashboard */}
                <Route
                    path="/"
                    element={authState?.token ? <Dashboard /> : <Login />}
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" />} />

                <Route path="/pie-chart" element={<PieChartPage />} />
            </Routes>
        </Router>
    );
};

export default App;
