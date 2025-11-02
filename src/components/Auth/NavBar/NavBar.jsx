import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearTokens } from '../../../lib/auth';

const NavBar = ({ user, setUser, onLogout }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        clearTokens();
        setUser(null);
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/ingredients" className="nav-link">Ingredients</Link>
                            <Link to="/products" className="nav-link">Products</Link>
                            <Link to="/notes" className="nav-link">Notes</Link>
                            <button onClick={handleLogout} className="nav-logout">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="nav-link">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;