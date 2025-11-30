import React, { useState } from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
    recipes: Recipe[];
    isLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    error: string | null;
    onSearch: (query: string) => void;
    onLoadMore: () => void;
    onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg animate-pulse">
        <div className="h-48 bg-gray-300 rounded-md mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
    </div>
);

const RecipeList: React.FC<RecipeListProps> = ({ recipes, isLoading, isLoadingMore, hasMore, error, onSearch, onLoadMore, onRecipeSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <RecipeSkeleton key={i} />)}
                </div>
            );
        }

        if (error && recipes.length === 0) {
            return (
                <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                    <p className="text-brand-red font-semibold">{error}</p>
                </div>
            );
        }

        if (recipes.length > 0) {
            return (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recipes.map((recipe, index) => (
                            <RecipeCard key={index} recipe={recipe} onSelect={onRecipeSelect} />
                        ))}
                    </div>
                    {hasMore && !isLoadingMore && (
                         <div className="text-center mt-8">
                            <button
                                onClick={onLoadMore}
                                className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition duration-200"
                            >
                                Load More Recipes
                            </button>
                        </div>
                    )}
                    {isLoadingMore && (
                         <div className="text-center mt-8">
                            <div className="flex justify-center items-center space-x-2 text-gray-500">
                               <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                               </svg>
                               <span>Loading more...</span>
                            </div>
                        </div>
                    )}
                </>
            );
        }

        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900">No recipes yet!</h3>
                <p className="mt-1 text-gray-500">Use the "Find Recipes" button or the search bar above to get started.</p>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">Recipe Suggestions</h2>
                {recipes.length > 0 && !isLoading && (
                    <span className="text-sm text-gray-500 font-medium bg-gray-200 px-3 py-1 rounded-full">
                        Showing {recipes.length} recipes
                    </span>
                )}
            </div>
            
            <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for recipes online (e.g., 'vegan pasta')"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading || !searchQuery.trim()}
                >
                    Search
                </button>
            </form>

            <div className="mb-6 flex flex-wrap gap-2 justify-center">
                {['Breakfast', 'Lunch', 'Dinner', 'Juices', 'Smoothies', 'Salads', 'Snacks', 'Dessert'].map(category => (
                    <button
                        key={category}
                        onClick={() => onSearch(category)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-200 text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            {error && recipes.length > 0 && <p className="text-brand-red font-semibold mb-4 text-center">{error}</p>}
            {renderContent()}
        </div>
    );
};

export default RecipeList;