import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearTokens } from '../../../lib/auth';

const NavBar = ({ isAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearTokens();
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>Home</Link>
                {isAuthenticated && (<>
                            <Link to="/ingredients" style={{ marginRight: '15px', textDecoration: 'none' }}>Ingredients</Link>
                            <Link to="/products" style={{ marginRight: '15px', textDecoration: 'none' }}>Products</Link>
                            <Link to="/notes" style={{ marginRight: '15px', textDecoration: 'none' }}>Notes</Link>
                        </>
                    )}
                </div>
                
                <div>
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
