import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Ingredient, IngredientCategory } from '../types';

interface AddIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (ingredient: Omit<Ingredient, 'id'> | Ingredient) => void;
    existingIngredient?: Ingredient;
}

const CATEGORIES: IngredientCategory[] = ['Meat', 'Vegetable', 'Fruit', 'Grain', 'Pulse', 'Dairy', 'Spice', 'Condiment'];

const UNITS = [
    // Weight
    'kg', 'g', 'lbs', 'oz',
    // Volume
    'L', 'mL', 'cups', 'tbsp', 'tsp', 'fl oz',
    // Count
    'pieces', 'whole', 'bunch', 'clove',
    // Package
    'pack', 'can', 'jar', 'bottle',
    // Other
    'to taste', 'as needed'
];

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ isOpen, onClose, onAdd, existingIngredient }) => {
    const [name, setName] = useState('');
    const [quantityNum, setQuantityNum] = useState('');
    const [unit, setUnit] = useState('pieces');
    const [expirationDate, setExpirationDate] = useState('');
    const [category, setCategory] = useState<IngredientCategory>('Vegetable');
    const [isDetectingCategory, setIsDetectingCategory] = useState(false);
    const [manuallyChanged, setManuallyChanged] = useState(false);
    const categorizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (existingIngredient) {
                setName(existingIngredient.name);
                // Parse existing quantity to extract number and unit
                const match = existingIngredient.quantity.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
                if (match) {
                    setQuantityNum(match[1]);
                    setUnit(match[2] || 'pieces');
                } else {
                    setQuantityNum('');
                    setUnit('pieces');
                }
                setExpirationDate(existingIngredient.expirationDate);
                setCategory(existingIngredient.category);
                setManuallyChanged(false);
            } else {
                setName('');
                setQuantityNum('');
                setUnit('pieces');
                setExpirationDate('');
                setCategory('Vegetable');
                setManuallyChanged(false);
            }
        }
    }, [existingIngredient, isOpen]);

    const detectCategory = useCallback(async (ingredientName: string) => {
        if (!ingredientName.trim() || manuallyChanged) return;

        setIsDetectingCategory(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                console.error('Gemini API key not found');
                setIsDetectingCategory(false);
                return;
            }

            const prompt = `Classify the following ingredient into ONE of these categories: Meat, Vegetable, Fruit, Grain, Pulse, Dairy, Spice, Condiment.
            
Ingredient: "${ingredientName}"

Respond with ONLY the category name, nothing else. Examples:
- chicken -> Meat
- tomato -> Vegetable
- apple -> Fruit
- rice -> Grain
- lentils -> Pulse
- milk -> Dairy
- cumin -> Spice
- ketchup -> Condiment`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (response.ok) {
                const result = await response.json();
                const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

                if (text && CATEGORIES.includes(text as IngredientCategory)) {
                    setCategory(text as IngredientCategory);
                }
            }
        } catch (error) {
            console.error('Error detecting category:', error);
        } finally {
            setIsDetectingCategory(false);
        }
    }, [manuallyChanged]);

    const handleNameChange = (newName: string) => {
        setName(newName);

        // Clear existing timeout
        if (categorizeTimeoutRef.current) {
            clearTimeout(categorizeTimeoutRef.current);
        }

        // Only auto-categorize if category hasn't been manually changed
        if (!manuallyChanged && newName.trim().length > 2) {
            // Debounce: wait 800ms after user stops typing
            categorizeTimeoutRef.current = setTimeout(() => {
                detectCategory(newName);
            }, 800);
        }
    };

    const handleCategoryChange = (newCategory: IngredientCategory) => {
        setCategory(newCategory);
        setManuallyChanged(true); // Mark as manually changed to prevent auto-override
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || (!quantityNum && unit !== 'to taste' && unit !== 'as needed') || !expirationDate) return;

        // Combine quantity number and unit
        const quantity = unit === 'to taste' || unit === 'as needed'
            ? unit
            : `${quantityNum} ${unit}`;

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
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                            Ingredient Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                            placeholder="e.g., Chicken, Tomato, Rice"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="col-span-1">
                            <label htmlFor="quantityNum" className="block text-gray-700 font-medium mb-1">
                                Amount<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="quantityNum"
                                value={quantityNum}
                                onChange={(e) => setQuantityNum(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                                placeholder="2"
                                min="0"
                                step="0.1"
                                required={unit !== 'to taste' && unit !== 'as needed'}
                            />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor="unit" className="block text-gray-700 font-medium mb-1">
                                Unit<span className="text-red-500">*</span>
                            </label>
                            <select
                                id="unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"
                                required
                            >
                                {UNITS.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                            Category<span className="text-red-500">*</span>
                            {isDetectingCategory && (
                                <span className="ml-2 text-xs text-blue-500">
                                    <svg className="inline animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            )}
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value as IngredientCategory)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white"
                            required
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="expirationDate" className="block text-gray-700 font-medium mb-1">
                            Expiration Date<span className="text-red-500">*</span>
                        </label>
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