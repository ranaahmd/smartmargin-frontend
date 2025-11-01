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
                <h4>{editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ingredient Name"
                                name="name"
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="col-3">
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="form-control"
                                placeholder="Cost"
                                name="cost_per_unit"
                                value={form.cost_per_unit}
                                onChange={(e) => setForm({...form, cost_per_unit: e.target.value})}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-control"
                                name="unit"
                                value={form.unit}
                                onChange={(e) => setForm({...form, unit: e.target.value})}
                                required
                            >
                                <option value="">Select Unit</option>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="piece">piece</option>
                            </select>
                        </div>
                        <div className="colum-v">
                            <button type="submit" className="btn-ingredients">
                                {editingIngredient ? 'Update' : 'Add'}
                            </button>
                            {editingIngredient && (
                                <button 
                                    type="button" 
                                    className="btn-ingre"
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