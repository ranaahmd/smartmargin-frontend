import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import SignUp from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import NavBar from "./components/Auth/NavBar/NavBar";
import { getUserFromToken, getTokens, clearTokens } from "./lib/auth";
import IngredientsList from './components/Ingredients/IngredientsList';
import NotesList from './components/Notes/NotesList';
import ProductDetail from './components/Product/ProductDeatils';
import ProductForm from './components/Product/ProductForm';
import ProductsList from './components/Product/ProductList';
//copied from cat-collector
export default function App() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        const tokenUser = getUserFromToken();
        setUser(tokenUser);
        const { access } = getTokens();
        setIsAuthenticated(!!access);
    };

    const handleLoginSuccess = () => {
        checkAuthentication();
    };

    const handleLogout = () => {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <NavBar  user={user} setUser={setUser} onLogout={handleLogout}/>
            <div className="pt-15 min-h-screen bg-gray-50"></div>
            <Routes>
                
                <Route path="/" element={
                     <div className="p-6">
                        <h1 className='"text-3xl font-bold mb-4"'>Home Page</h1>
                         <p className="space-x-4">
                            <Link className="text-blue-600 hover:text-blue-800"  to="/signup">Sign Up</Link> | 
                            <Link className="text-blue-600 hover:text-blue-800"  to="/login">Login</Link> | 
                            <Link className="text-blue-600 hover:text-blue-800"  to="/notes">Notes</Link> |
                            <Link  className="text-blue-600 hover:text-blue-800" to="/ingredients">Ingredients</Link> |
                            <Link  className="text-blue-600 hover:text-blue-800" to="/products">Products</Link>
                        </p>
                    </div>
                } />
                <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/ingredients" replace />}/>
                <Route path="/login" element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/ingredients" replace />}/>
                <Route path="/notes" element={isAuthenticated ? <NotesList /> : <Navigate to="/login" replace />}/>
                <Route path="/ingredients" element={isAuthenticated ? <IngredientsList /> : <Navigate to="/login" replace />}/>
                <Route path="/products" element={isAuthenticated ? <ProductsList /> : <Navigate to="/login" replace />}/>
                <Route path="/products/add" element={isAuthenticated ? <ProductForm /> : <Navigate to="/login" replace />}/>
                <Route path="/products/edit/:id" element={isAuthenticated ? <ProductForm /> : <Navigate to="/login" replace />}/>
                <Route path="/products/:id" element={isAuthenticated ? <ProductDetail /> : <Navigate to="/login" replace />}/>
                <Route path="*" element={<Navigate to="/" replace />}/>
            </Routes>
        </Router>
    );
}