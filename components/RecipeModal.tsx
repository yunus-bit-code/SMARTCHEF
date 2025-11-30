import React from 'react';
import type { Recipe } from '../types';

interface RecipeModalProps {
    recipe: Recipe | null;
    onClose: () => void;
    videoUrl: string | null;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, videoUrl }) => {
    if (!recipe) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 max-h-full overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">{recipe.title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-bold">&times;</button>
                    </div>
                    <div className="mb-6" style={{paddingTop: '56.25%', position: 'relative'}}>
                        {videoUrl ? (
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={videoUrl}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Recipe Video"
                            ></iframe>
                        ) : (
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-300 flex items-center justify-center">
                                <p className="text-gray-500">Searching for video...</p>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">Ingredients</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className={`${ing.inPantry ? 'text-brand-green font-medium' : ''}`}>
                                        {ing.quantity} {ing.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">Details</h3>
                            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
                            <p><strong>Cook Time:</strong> {recipe.cookTime} minutes</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-700">Instructions</h3>
                        <ol className="list-decimal list-inside space-y-2">
                            {recipe.instructions.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
