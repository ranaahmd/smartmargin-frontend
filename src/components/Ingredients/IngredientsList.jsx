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
    const [showForm, setShowForm] = useState(false);
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
                setSuccess('Ingredient updated successfully!');
            } else {
                await authRequest({
                    method: 'POST',
                    url: 'http://127.0.0.1:8000/api/ingredients/',
                    data: submitData
                });
                setSuccess('Ingredient added successfully!');
            }

            fetchIngredients();
            setEditingIngredient(null);
            setShowForm(false);
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
        if (!window.confirm('Are you sure you want to delete this ingredient?')) return;

        try {
            await authRequest({
                method: 'DELETE',
                url: `http://127.0.0.1:8000/api/ingredients/${id}/`
            });
            setSuccess('Ingredient deleted successfully!');
            fetchIngredients();
        } catch (err) {
            setError('Failed to delete ingredient');
        }
    };

    const startEditing = (ingredient) => {
        setEditingIngredient(ingredient);
        setShowForm(true);
    };

    const cancelEdit = () => {
        setEditingIngredient(null);
        setShowForm(false);
    };

    return (
        <section className="py-12 bg-[#2d2d2d] min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Ingredients Management</h2>
                    <button 
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ Add Ingredient'}
                    </button>
                </div>

                {success && (
                    <div className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {showForm && (
                    <div className="bg-amber-200 rounded-2xl shadow-2xl p-6 mb-8">
                        <IngredientForm 
                            onSubmit={handleAddOrUpdateIngredient}
                            editingIngredient={editingIngredient}
                            onCancel={cancelEdit}
                        />
                    </div>
                )}

                <div className="bg-amber-200 rounded-2xl shadow-2xl p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ingredients List</h3>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : ingredients.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-700 text-lg">No ingredients found</p>
                            <button 
                                className="bg-[#2d2d2d] text-white px-6 py-2 rounded-full mt-4 hover:bg-[#444] transition-all"
                                onClick={() => setShowForm(true)}
                            >
                                Add Your First Ingredient
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-gray-300">
                                        <th className="pb-3 text-gray-700 font-bold">Name</th>
                                        <th className="pb-3 text-gray-700 font-bold">Cost/Unit</th>
                                        <th className="pb-3 text-gray-700 font-bold">Unit</th>
                                        <th className="pb-3 text-gray-700 font-bold">Created</th>
                                        <th className="pb-3 text-gray-700 font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients.map(ingredient => (
                                        <tr key={ingredient.id} className="border-b border-gray-200 hover:bg-amber-100 transition-colors">
                                            <td className="py-4 text-gray-900 font-medium">{ingredient.name}</td>
                                            <td className="py-4 text-gray-900">${parseFloat(ingredient.cost_per_unit).toFixed(2)}</td>
                                            <td className="py-4 text-gray-900">{ingredient.unit}</td>
                                            <td className="py-4 text-gray-900">{new Date(ingredient.created).toLocaleDateString()}</td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all text-sm"
                                                        onClick={() => startEditing(ingredient)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all text-sm"
                                                        onClick={() => handleDelete(ingredient.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default IngredientsList;