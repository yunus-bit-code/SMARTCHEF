import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const imageUrl = `https://picsum.photos/seed/${recipe.title.replace(/\s/g, '')}/400/300`;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300">
            <img src={imageUrl} alt={recipe.title} className="w-full h-48 object-cover"/>
            <div className="p-4 flex flex-col flex-grow">
                <span className="text-sm text-brand-green font-semibold mb-1">{recipe.cuisine} &bull; {recipe.cookTime} mins</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{recipe.description}</p>
                
                <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <ul className="space-y-1 text-sm">
                        {recipe.ingredients.map((ing, index) => (
                            <li key={index} className="flex items-center">
                                {ing.inPantry ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span className={!ing.inPantry ? 'text-red-500' : 'text-gray-700'}>{ing.quantity} {ing.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-auto">
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>

                {recipe.sources && recipe.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold mb-2 text-sm">Sources:</h4>
                        <ul className="space-y-1 text-sm">
                            {recipe.sources.map((source, index) => (
                                <li key={index} className="truncate">
                                    <a 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                        title={source.uri}
                                    >
                                        {source.title || new URL(source.uri).hostname}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeCard;
