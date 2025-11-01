import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authRequest, getTokens } from '../../lib/auth';

const ProductForm = () => {
    const [form, setForm] = useState({ 
        name: '', 
        profit_margin: '30',
        ingredients: [] 
    });
}
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [calculations, setCalculations] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    useEffect(() => {
        if (!getTokens().access) navigate('/login');
        loadIngredients();
        if (isEditing) loadProduct();
    }, [navigate, id]);