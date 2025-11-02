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
    const loadProduct = async () => {
        try {
            const response = await authRequest({ method: 'GET', url: `http://127.0.0.1:8000/api/products/${id}/` });
            setForm({ name: response.data.name, profit_margin: response.data.profit_margin?.toString() || '30' });
            setIngredients(response.data.ingredients || []);
        } catch (err) {
            console.error('Error loading product');
        }
    };

    const addIngredient = () => {
        if (!selectedIngredient || !quantity) return;
        const ingredient = allIngredients.find(i => i.id.toString() === selectedIngredient);
        if (!ingredient) return;
        const newIngredient = {
            ingredient_id: ingredient.id,
            ingredient_name: ingredient.name,
            quantity: parseFloat(quantity),
            unit: ingredient.unit,
            unit_cost: ingredient.cost_per_unit,
            total_cost: ingredient.cost_per_unit * parseFloat(quantity)
        };
        setIngredients(prev => [...prev, newIngredient]);
        setSelectedIngredient('');
        setQuantity('');
    };

    const removeIngredient = (index) => {
        setIngredients(prev => prev.filter((_, i) => i !== index)); //copied from someone in reddit
    };

}
};

export default ProductForm;