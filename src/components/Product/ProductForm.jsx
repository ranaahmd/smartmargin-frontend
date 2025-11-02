import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authRequest, getTokens } from '../../lib/auth';
import "../../App.css";
//code quote part from: 
// https://www.geeksforgeeks.org/reactjs/reactjs-calculator-app-adding-functionality/
//https://medium.com/@blogshub4/how-to-create-the-investment-calculator-in-react-js-6ac60e52e7a8
//https://github.com/codeofrelevancy/profit-margin-calculator

const ProductForm = () => {
    const [form, setForm] = useState({ name: '', profit_percentage: '30' });
    const [ingredients, setIngredients] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    useEffect(() => {
        if (!getTokens().access) navigate('/login');
        loadAllIngredients();
        if (isEditing) loadProduct();
    }, [id, navigate, isEditing]);

    const loadAllIngredients = async () => {
        try {
            const response = await authRequest({ 
                method: 'GET', 
                url: 'http://127.0.0.1:8000/api/ingredients/' 
            });
            setAllIngredients(response.data || []);
        } catch (err) {
            setAllIngredients([]);
        }
    };

    const loadProduct = async () => {
        try {
            const response = await authRequest({ 
                method: 'GET', 
                url: `http://127.0.0.1:8000/api/products/${id}/` 
            });
            setForm({ 
                name: response.data.name, 
                profit_percentage: response.data.profit_percentage?.toString() || '30'
            });
            setIngredients(response.data.ingredients || []);
        } catch (err) {
            alert('Failed to load product');
        }
    };

    const addIngredient = () => {
        if (!selectedIngredient || !quantity) {
            alert('Please select an ingredient and enter quantity');
            return;
        }
        
        const ingredient = allIngredients.find(i => i.id.toString() === selectedIngredient);
        if (!ingredient) return;
        
        const newIngredient = {
            ingredient: ingredient.id,
            quantity: parseFloat(quantity)
        };
        
        setIngredients(prev => [...prev, newIngredient]);
        setSelectedIngredient('');
        setQuantity('');
    };

    const removeIngredient = (index) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const calculateCosts = () => {
        const totalCost = ingredients.reduce((sum, item) => {
            const ingredient = allIngredients.find(i => i.id === item.ingredient);
            return sum + (ingredient ? ingredient.cost_per_unit * item.quantity : 0);
        }, 0);
        const profitPercentage = parseFloat(form.profit_percentage) || 0;
        const profitAmount = totalCost * (profitPercentage / 100);
        const sellingPrice = totalCost + profitAmount;
        
        return { 
            totalCost: totalCost.toFixed(2), 
            profitAmount: profitAmount.toFixed(2), 
            sellingPrice: sellingPrice.toFixed(2) 
        };
    };

    const calculations = calculateCosts();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (!form.name.trim()) {
            alert('Product name is required');
            setLoading(false);
            return;
        }
        
        if (ingredients.length === 0) {
            alert('At least one ingredient is required');
            setLoading(false);
            return;
        }

        try {
            const productData = { 
                name: form.name.trim(), 
                profit_percentage: parseFloat(form.profit_percentage),
                ingredients: ingredients.map(item => ({
                    ingredient: item.ingredient,
                    quantity: parseFloat(item.quantity)
                }))
            };
            
            if (isEditing) {
                await authRequest({ 
                    method: 'PUT', 
                    url: `http://127.0.0.1:8000/api/products/${id}/`, 
                    data: productData 
                });
            } else {
                await authRequest({ 
                    method: 'POST', 
                    url: 'http://127.0.0.1:8000/api/products/', 
                    data: productData 
                });
            }
            
            navigate('/products');
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData && typeof errorData === 'object') {
                const errorMessages = [];
                for (const [key, value] of Object.entries(errorData)) {
                    errorMessages.push(`${key}: ${Array.isArray(value) ? value[0] : value}`);
                }
                setError(errorMessages.join(', '));
            } else {
                setError('Failed to save product');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-productform">
            <div className="items-center">
                <h2>{isEditing ? 'Edit Product' : 'Create Product'}</h2>
                <button className="btn-outline" onClick={() => navigate('/products')}>
                    Back to Products
                </button>
            </div>

            {error && <div className="alert alert-danger">Error: {error}</div>}

            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="label-p">
                                    <label>Product Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={form.name} 
                                        onChange={e => setForm({...form, name: e.target.value})} 
                                        required 
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="label-p">
                                    <label>Profit Percentage (%)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={form.profit_percentage} 
                                        onChange={e => setForm({...form, profit_percentage: e.target.value})} 
                                        min="0" 
                                        max="100" 
                                        required 
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="label-p">
                                    <h6>Add Ingredients</h6>
                                    <div className="row-si">
                                        <div className="col-si">
                                            <select 
                                                className="form-control" 
                                                value={selectedIngredient} 
                                                onChange={e => setSelectedIngredient(e.target.value)}
                                                disabled={loading}
                                            >
                                                <option value="">Select Ingredient</option>
                                                {allIngredients.map(ingredient => (
                                                    <option key={ingredient.id} value={ingredient.id}>
                                                        {ingredient.name} (${ingredient.cost_per_unit}/{ingredient.unit})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col">
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                placeholder="Quantity" 
                                                value={quantity} 
                                                onChange={e => setQuantity(e.target.value)} 
                                                step="0.01" 
                                                min="0.01" 
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="col-p">
                                            <button 
                                                type="button" 
                                                className="btn-add" 
                                                onClick={addIngredient}
                                                disabled={loading}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {ingredients.length > 0 && (
                                    <div className="si">
                                        <h6>Selected Ingredients</h6>
                                        <div className="table-responsive">
                                            <table className="table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Ingredient</th>
                                                        <th>Qty</th>
                                                        <th>Cost</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ingredients.map((item, index) => {
                                                        const ingredient = allIngredients.find(i => i.id === item.ingredient);
                                                        return (
                                                            <tr key={index}>
                                                                <td>{ingredient?.name || 'Loading...'}</td>
                                                                <td>{item.quantity} {ingredient?.unit}</td>
                                                                <td>${ingredient ? (ingredient.cost_per_unit * item.quantity).toFixed(2) : '0.00'}</td>
                                                                <td>
                                                                    <button 
                                                                        type="button" 
                                                                        className="btn-remove" 
                                                                        onClick={() => removeIngredient(index)}
                                                                        disabled={loading}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="form-buttons">
                                    <button type="submit" className="btn-success" disabled={loading}>
                                        {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-can" 
                                        onClick={() => navigate('/products')}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <h5>Calculation</h5>
                            <div><strong>Total Cost:</strong> ${calculations.totalCost}</div>
                            <div><strong>Profit:</strong> ${calculations.profitAmount}</div>
                            <div><strong>Selling Price:</strong> ${calculations.sellingPrice}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;