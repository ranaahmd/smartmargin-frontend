import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { clearTokens } from '../../../lib/auth';
import { Cake, Menu, X } from 'lucide-react';

const NavBar = ({ user, setUser, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false); 
    const toggleMenu = () => setIsOpen(!isOpen);
    
    const protectedLinks = [
        { name: "Ingredients", path: '/ingredients' },
        { name: "Products", path: '/products' },
        { name: "Notes", path: '/notes' },
    ];
    
    const navigate = useNavigate();
    
    const handleLogout = () => {
        clearTokens();
        setUser(null);
        onLogout();
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="w-full fixed top-0 left-0 z-30 bg-[#2d2d2d] text-white">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Cake className='w-7 h-7 text-amber-200'/>
                    <span className='text-xl font-bold'>
                       Smart <span className='text-amber-200'>Margin</span>
                    </span>
                </div>
                
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/" className="hover:text-amber-200 transition text-sm">Home</Link>
                            {protectedLinks.map((link) => (
                                <Link 
                                    key={link.name}
                                    to={link.path}
                                    className="hover:text-amber-200 transition text-sm"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="hover:text-amber-200 transition text-sm">Home</Link>
                            <Link to="/login" className="hover:text-amber-200 transition text-sm">Login</Link>
                            <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition text-sm">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                <div className='md:hidden'>
                    <button onClick={toggleMenu} className='text-amber-200'>
                        {isOpen ? <X size={26}/> : <Menu size={26}/>}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className='md:hidden bg-amber-950 py-3 space-y-3 text-center font-medium text-gray-100 text-sm'>
                    {user ? (
                        <>
                            <Link 
                                to="/" 
                                className='block hover:text-amber-200 py-2'
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            {protectedLinks.map((link) => (
                                <Link 
                                    key={link.name}
                                    to={link.path}
                                    className='block hover:text-amber-200 py-2'
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition mx-auto block"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/" 
                                className='block hover:text-amber-200 py-2'
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/login" 
                                className='block hover:text-amber-200 py-2'
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className='block bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition mx-auto'
                                onClick={() => setIsOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavBar;