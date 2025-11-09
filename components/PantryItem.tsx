import React, { useState, useMemo } from 'react';
import type { Ingredient, IngredientCategory } from '../types';
import AddIngredientModal from './AddIngredientModal';

interface PantryItemProps {
    ingredient: Ingredient;
    onRemove: (id: string) => void;
    onUpdate: (ingredient: Ingredient) => void;
}

const CATEGORY_COLORS: Record<IngredientCategory, { bg: string; text: string; border: string }> = {
    'Meat': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
    'Vegetable': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    'Fruit': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    'Grain': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    'Pulse': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
    'Dairy': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    'Spice': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    'Condiment': { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
};


const getDaysUntilExpiration = (date: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(date);
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const PantryItem: React.FC<PantryItemProps> = ({ ingredient, onRemove, onUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const daysUntilExpiration = useMemo(() => getDaysUntilExpiration(ingredient.expirationDate), [ingredient.expirationDate]);

    const expirationStatusColor = useMemo(() => {
        if (daysUntilExpiration < 0) return 'bg-brand-red';
        if (daysUntilExpiration <= 3) return 'bg-brand-red';
        if (daysUntilExpiration <= 7) return 'bg-brand-yellow';
        return 'bg-brand-green';
    }, [daysUntilExpiration]);

    const expirationText = useMemo(() => {
        if (daysUntilExpiration < 0) return `Expired ${Math.abs(daysUntilExpiration)} days ago`;
        if (daysUntilExpiration === 0) return 'Expires today';
        if (daysUntilExpiration === 1) return 'Expires tomorrow';
        return `Expires in ${daysUntilExpiration} days`;
    }, [daysUntilExpiration]);
    
    const categoryColors = CATEGORY_COLORS[ingredient.category];

    return (
        <div className={`p-3 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center transition-shadow hover:shadow-md`}>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                     <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border`}>
                        {ingredient.category}
                    </span>
                    <p className="font-semibold text-gray-800 truncate">{ingredient.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${expirationStatusColor}`}></span>
                    <span className="italic">{expirationText}</span>
                    <span className="text-gray-300">|</span>
                    <span>{ingredient.quantity}</span>
                </div>
            </div>
            <div className="flex space-x-1 ml-2">
                <button onClick={() => setIsEditModalOpen(true)} className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                </button>
                <button onClick={() => onRemove(ingredient.id)} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
             <AddIngredientModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                onAdd={onUpdate}
                existingIngredient={ingredient}
            />
        </div>
    );
};

export default PantryItem;