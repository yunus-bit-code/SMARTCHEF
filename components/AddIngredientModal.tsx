import React, { useState, useEffect } from 'react';
import type { Ingredient, IngredientCategory } from '../types';

interface AddIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (ingredient: Omit<Ingredient, 'id'> | Ingredient) => void;
    existingIngredient?: Ingredient;
}

const CATEGORIES: IngredientCategory[] = ['Meat', 'Vegetable', 'Fruit', 'Grain', 'Pulse', 'Dairy', 'Spice', 'Condiment'];

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ isOpen, onClose, onAdd, existingIngredient }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [category, setCategory] = useState<IngredientCategory>('Vegetable');

    useEffect(() => {
        if (isOpen) {
            if (existingIngredient) {
                setName(existingIngredient.name);
                setQuantity(existingIngredient.quantity);
                setExpirationDate(existingIngredient.expirationDate);
                setCategory(existingIngredient.category);
            } else {
                setName('');
                setQuantity('');
                setExpirationDate('');
                setCategory('Vegetable');
            }
        }
    }, [existingIngredient, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !quantity || !expirationDate) return;

        const ingredientData = { name, quantity, expirationDate, category };
        if (existingIngredient) {
            onAdd({ ...ingredientData, id: existingIngredient.id });
        } else {
            onAdd(ingredientData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-4">{existingIngredient ? 'Edit' : 'Add'} Ingredient</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Ingredient Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="quantity" className="block text-gray-700 font-medium mb-1">Quantity</label>
                            <input
                                type="text"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="e.g., 2 lbs"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-gray-700 font-medium mb-1">Category</label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as IngredientCategory)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="expirationDate" className="block text-gray-700 font-medium mb-1">Expiration Date</label>
                        <input
                            type="date"
                            id="expirationDate"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600">
                            {existingIngredient ? 'Save Changes' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddIngredientModal;