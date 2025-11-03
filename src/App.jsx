import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import NavBar from "./components/Auth/NavBar/NavBar";
import Heros from './components/Auth/NavBar/Heros';
import { getUserFromToken, getTokens, clearTokens } from "./lib/auth";
import IngredientsList from './components/Ingredients/IngredientsList';
import NotesList from './components/Notes/NotesList';
import ProductDetail from './components/Product/ProductDeatils';
import ProductForm from './components/Product/ProductForm';
import ProductsList from './components/Product/ProductList';

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
            <NavBar user={user} setUser={setUser} onLogout={handleLogout}/>
            <Routes>
                <Route path="/" element={
    <div className="bg-[#2d2d2d] min-h-screen">
        <Heros/>
        {isAuthenticated && <ProductsList />}
    </div>
} />
               
                <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />}/>
                <Route path="/login" element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />}/>
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