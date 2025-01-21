import React, { useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import ReportTable from '../Report/ReportTable'; // Import the ReportTable component
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();

    // Retrieve the logged-in username and role from localStorage
    const username = localStorage.getItem('username');
    const { logout } = useContext(AuthContext);

    return (
        <div className="dashboard" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#4A90E2', // Soft Blue background
                    padding: '10px 30px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    margin: '0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    color: 'white',
                    borderBottom: '2px solid #1C2B4C', // Darker blue border for better contrast
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                        {username ? `Hello, ${username.toUpperCase()}` : 'Welcome to the Task Display System'}
                    </h2>
                </div>
                {/* Scrolling text here */}
                <h1
                    style={{
                        margin: 0,
                        fontSize: '22px',
                        textAlign: 'center',
                        flexGrow: 1,
                        fontWeight: 'bold',
                        cursor: 'default',
                        whiteSpace: 'nowrap',  // Prevents wrapping
                        overflow: 'hidden',    // Hide text when it overflows
                        position: 'relative',  // For animation
                    }}
                >
                    <span style={{
                        display: 'inline-block',
                        animation: 'scroll-left 10s linear infinite', // Scroll animation applied here
                    }}>
                        Web Activity Tracking Reports
                    </span>
                </h1>
                <button
                    onClick={logout}
                    style={{
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        padding: '12px 20px',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#d44f4f'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
                >
                    Logout
                </button>
            </header>

            <main style={{ flex: 1, paddingBottom: '50px' }}> {/* Adjust for footer space */}
                {/* Default page content is the ReportTable */}
                <ReportTable />
            </main>

            <footer style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#4A90E2', // Soft Blue background
                padding: '10px 0',
                boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 1,
                color: 'white',
                borderTop: '2px solid rgb(71, 119, 224)', // Darker blue border for better contrast
            }}>
                <p style={{ margin: 0 }}>© 2025 OSB Group. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
