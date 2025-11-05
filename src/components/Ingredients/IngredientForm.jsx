import React, { useState, useEffect } from 'react';

const IngredientForm = ({ onSubmit, editingIngredient, onCancel }) => {
    const [form, setForm] = useState({ name: '', cost_per_unit: '', unit: '' });

    useEffect(() => {
        if (editingIngredient) {
            setForm({
                name: editingIngredient.name,
                cost_per_unit: editingIngredient.cost_per_unit,
                unit: editingIngredient.unit
            });
        } else {
            setForm({ name: '', cost_per_unit: '', unit: '' });
        }
    }, [editingIngredient]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.name && form.cost_per_unit && form.unit) {
            onSubmit(form);
        }
    };

    return (
        <div className="ingredient-form-card">
            <div className="card-header">
                <h4 className="text-xl font-bold text-gray-800">
                    {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
                </h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        {/* Name Field */}
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ingredient Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                                         focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                                         transition-all duration-200 placeholder-gray-400"
                                placeholder="Enter ingredient name"
                                name="name"
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                required
                            />
                        </div>

                        {/* Cost Field */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cost per Unit
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-lg 
                                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                                             transition-all duration-200 placeholder-gray-400"
                                    placeholder="0.00"
                                    name="cost_per_unit"
                                    value={form.cost_per_unit}
                                    onChange={(e) => setForm({...form, cost_per_unit: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Unit Field */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit Type
                            </label>
                            <select
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg 
                                         focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                                         transition-all duration-200"
                                name="unit"
                                value={form.unit}
                                onChange={(e) => setForm({...form, unit: e.target.value})}
                                required
                            >
                                <option value="" className="text-gray-400">Select Unit</option>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Gram (g)</option>
                                <option value="lb">Pound (lb)</option>
                                <option value="oz">Ounce (oz)</option>
                                <option value="l">Liter (l)</option>
                                <option value="ml">Milliliter (ml)</option>
                                <option value="cup">Cup</option>
                                <option value="tbsp">Tablespoon</option>
                                <option value="tsp">Teaspoon</option>
                                <option value="piece">Piece</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 flex gap-2">
                            <button 
                                type="submit" 
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white 
                                         px-6 py-3 rounded-lg transition-all duration-200 
                                         hover:scale-105 font-medium shadow-md"
                            >
                                {editingIngredient ? 'Update' : 'Add'}
                            </button>
                            {editingIngredient && (
                                <button 
                                    type="button" 
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white 
                                             px-4 py-3 rounded-lg transition-all duration-200 
                                             font-medium shadow-md"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IngredientForm;