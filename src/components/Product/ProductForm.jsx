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
    const isEditing = !!id;

    useEffect(() => {
        if (!getTokens().access) navigate('/login');
        loadAllIngredients();
        if (isEditing) loadProduct();
    }, [id, navigate, isEditing]);

    const loadAllIngredients = async () => {
        try {
            const response = await authRequest({ method: 'GET', url: 'http://127.0.0.1:8000/api/ingredients/' });
            setAllIngredients(response.data || []);
        } catch (err) {
            setAllIngredients([]);
        }
    };

    const loadProduct = async () => {
        try {
            const response = await authRequest({ method: 'GET', url: `http://127.0.0.1:8000/api/products/${id}/` });
            setForm({ 
                name: response.data.name, 
                profit_margin: response.data.profit_margin?.toString() || '30' 
            });
            setIngredients(response.data.ingredients || []);
        } catch (err) {
            console.error('Error loading product');
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
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };
// one of my classmate got me this idea
    const calculateCosts = () => {
        const totalCost = ingredients.reduce((sum, item) => sum + (item.total_cost || 0), 0);
        const profitMargin = parseFloat(form.profit_margin) || 0;
        const profitAmount = totalCost * (profitMargin / 100);
        const sellingPrice = totalCost + profitAmount;
        
        return { 
            totalCost: totalCost.toFixed(2), 
            profitAmount: profitAmount.toFixed(2), 
            sellingPrice: sellingPrice.toFixed(2) 
        };
    };
// from youtup 
    const calculations = calculateCosts();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.name.trim()) {
            alert('Product name is required');
            return;
        }
        
        if (ingredients.length === 0) {
            alert('At least one ingredient is required');
            return;
        }

        try {
            const productData = { 
                name: form.name.trim(), 
                profit_margin: parseFloat(form.profit_margin), 
                ingredients 
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
            console.error('Save error:', err);
            alert('Failed to save product. Please check console for details.');
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
                                    />
                                </div>
                                
                                <div className="label-p">
                                    <label>Profit Margin (%)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={form.profit_margin} 
                                        onChange={e => setForm({...form, profit_margin: e.target.value})} 
                                        min="0" 
                                        max="100" 
                                        required 
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
                                            />
                                        </div>
                                        <div className="col-p">
                                            <button 
                                                type="button" 
                                                className="btn-add" 
                                                onClick={addIngredient}
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
                                                    {ingredients.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.ingredient_name}</td>
                                                            <td>{item.quantity} {item.unit}</td>
                                                            <td>${item.total_cost?.toFixed(2)}</td>
                                                            <td>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn-remove" 
                                                                    onClick={() => removeIngredient(index)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="form-buttons">
                                    <button type="submit" className="btn-success">
                                        {isEditing ? 'Update Product' : 'Create Product'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-can" 
                                        onClick={() => navigate('/products')}
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