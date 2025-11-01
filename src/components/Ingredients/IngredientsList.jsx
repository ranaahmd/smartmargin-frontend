import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRequest, getTokens, clearTokens } from '../../lib/auth';
import IngredientForm from './IngredientForm';

const IngredientsList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingIngredient, setEditingIngredient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const { access } = getTokens();
        if (!access) navigate('/login');
        else fetchIngredients();
    }, [navigate]);

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            const response = await authRequest({
                method: 'GET',
                url: 'http://127.0.0.1:8000/api/ingredients/'
            });
            setIngredients(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                clearTokens();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdateIngredient = async (formData) => {
        try {
            setError('');
            const submitData = {
                name: formData.name.trim(),
                cost_per_unit: parseFloat(formData.cost_per_unit),
                unit: formData.unit
            };

            if (editingIngredient) {
                await authRequest({
                    method: 'PUT',
                    url: `http://127.0.0.1:8000/api/ingredients/${editingIngredient.id}/`,
                    data: submitData
                });
                setSuccess('Ingredient updated!');
            } else {
                await authRequest({
                    method: 'POST',
                    url: 'http://127.0.0.1:8000/api/ingredients/',
                    data: submitData
                });
                setSuccess('Ingredient added!');
            }

            fetchIngredients();
            setEditingIngredient(null);
        } catch (err) {
            if (err.response?.status === 401) {
                clearTokens();
                navigate('/login');
            } else {
                setError('Failed to save ingredient');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ingredient?')) return;

        try {
            await authRequest({
                method: 'DELETE',
                url: `http://127.0.0.1:8000/api/ingredients/${id}/`
            });
            setSuccess('Ingredient deleted!');
            fetchIngredients();
        } catch (err) {
            setError('Failed to delete ingredient');
        }
    };

    return (
        <div className="ingredients-container">
            <div className="mangament">
                <h2>Ingredients Management</h2>
                <button 
                    className="btn btn-outline-danger"
                    onClick={() => { clearTokens(); navigate('/login'); }}
                >
                    Logout
                </button>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <IngredientForm 
                onSubmit={handleAddOrUpdateIngredient}
                editingIngredient={editingIngredient}
                onCancel={() => setEditingIngredient(null)}
            />

            <div className="ingredients-list">
                <h4>Ingredients List</h4>
                {loading ? (
                    <div className="text-center"><div className="spinner-border" /></div>
                ) : ingredients.length === 0 ? (
                    <div className="alert alert-info">No ingredients found</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Cost/Unit</th>
                                    <th>Unit</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients.map(ingredient => (
                                    <tr key={ingredient.id}>
                                        <td>{ingredient.name}</td>
                                        <td>${parseFloat(ingredient.cost_per_unit).toFixed(2)}</td>
                                        <td>{ingredient.unit}</td>
                                        <td>{new Date(ingredient.created).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning mr-2"
                                                onClick={() => setEditingIngredient(ingredient)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-list"
                                                onClick={() => handleDelete(ingredient.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngredientsList;