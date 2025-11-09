
import React, { useState } from 'react';
import type { Ingredient } from '../types';
import PantryItem from './PantryItem';
import AddIngredientModal from './AddIngredientModal';

interface PantryProps {
    ingredients: Ingredient[];
    onAdd: (ingredient: Omit<Ingredient, 'id'>) => void;
    onRemove: (id: string) => void;
    onUpdate: (ingredient: Ingredient) => void;
    onFindRecipes: () => void;
    isLoading: boolean;
}

const Pantry: React.FC<PantryProps> = ({ ingredients, onAdd, onRemove, onUpdate, onFindRecipes, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const sortedIngredients = [...ingredients].sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());

    return (
        <div className="bg-white py-4 px-2 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">My Pantry</h2>
            
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Add Item</span>
                </button>
                <button
                    onClick={() => alert("Voice input feature coming soon!")}
                    className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                    title="Add via voice"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                        <path d="M5.5 11.5a4.5 4.5 0 009 0H16a6 6 0 01-5 5.91V19H9v-1.59A6 6 0 014 11.5h1.5z" />
                    </svg>
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-2">
                {sortedIngredients.length > 0 ? (
                    sortedIngredients.map(ingredient => (
                        <PantryItem key={ingredient.id} ingredient={ingredient} onRemove={onRemove} onUpdate={onUpdate} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">Your pantry is empty. Add some items to get started!</p>
                )}
            </div>

            <button
                onClick={onFindRecipes}
                disabled={isLoading || ingredients.length === 0}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
                 {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Finding Recipes...
                    </>
                ) : (
                    "Find Recipes"
                )}
            </button>

            <AddIngredientModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAdd={onAdd}
            />
        </div>
    );
};

export default Pantry;
