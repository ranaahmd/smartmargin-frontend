import React from 'react';
import { Link } from 'react-router-dom';
import { clearTokens } from '../../../lib/auth';
const NavBar = ({ user, setUser, onLogout }) => {
    const handleLogout = () => {
        clearTokens();
        setUser(null);
        if (onLogout) {
            onLogout();
        }
        window.location.href = '/login';
    };
    return (
        <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>Home</Link>
                    {user && (
                        <>
                            <Link to="/ingredients" style={{ marginRight: '15px', textDecoration: 'none' }}>Ingredients</Link>
                            <Link to="/notes" style={{ marginRight: '15px', textDecoration: 'none' }}>Notes</Link>
                        </>
                    )}
                </div>
                
                <div>
                    {user ? (
                        <div>
                            <span style={{ marginRight: '15px' }}>Welcome, {user.username}</span>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;