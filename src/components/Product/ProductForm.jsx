import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authRequest, getTokens } from '../../lib/auth';

const ProductForm = () => {
    const [form, setForm] = useState({ name: '', profit_margin: '30' });
    const [ingredients, setIngredients] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id; //the idea of this line from geekforgeeks

    useEffect(() => {
        if (!getTokens().access) navigate('/login');
        loadAllIngredients();
        if (isEditing) loadProduct();
    }, [id]);

    const loadAllIngredients = async () => {
        try {
            const response = await authRequest({ method: 'GET', url: 'http://127.0.0.1:8000/api/ingredients/' });
            setAllIngredients(response.data || []);
        } catch (err) {
            setAllIngredients([]);
        }
    };

};

export default ProductForm;