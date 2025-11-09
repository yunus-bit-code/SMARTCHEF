import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Ingredient, Recipe } from './types';
import Header from './components/Header';
import Pantry from './components/Pantry';
import RecipeList from './components/RecipeList';
import Footer from './components/Footer';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const RECIPES_PER_PAGE = 6;

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const currentQueryRef = useRef<string>('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "ingredients"), (snapshot) => {
            const ingredientsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Ingredient[];
            setIngredients(ingredientsData);
        });
        return () => unsubscribe();
    }, []);


    const fetchRecipesFromAPI = async (query: string, isLoadMore: boolean = false) => {
        const pantryList = ingredients.map(i => i.name.toLowerCase());
        const previousRecipes = isLoadMore ? recipes.map(r => r.title) : [];

        const prompt = `
            You are a recipe assistant. Your task is to find ${RECIPES_PER_PAGE} diverse recipes based on the user's request: "${query}".
            You must use your knowledge and search the web for real, popular recipes.
            ${previousRecipes.length > 0 ? `You have already suggested these recipes, so please provide different ones: ${previousRecipes.join(', ')}.` : ''}

            The user has the following ingredients in their pantry: ${pantryList.join(', ')}. When you list ingredients for each recipe, you MUST determine if each ingredient is in the user's pantry. An ingredient is in the pantry if its name is a substring of any item in the pantry list (e.g., 'chicken' matches 'chicken breast'). Be flexible with matching.

            Your response MUST be a single, valid JSON array of recipe objects, enclosed in a JSON markdown block. Do not include any text outside of the markdown block.

            Each recipe object in the JSON array must have this exact structure:
            {
              "title": "Recipe Title",
              "description": "A short, enticing description of the dish.",
              "cuisine": "Cuisine type (e.g., Italian, Mexican)",
              "cookTime": 60,
              "ingredients": [
                { "name": "Ingredient Name", "quantity": "e.g., 1 cup", "inPantry": true }
              ],
              "instructions": [
                "Step 1...",
                "Step 2..."
              ]
            }
        `;
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const text = response.text;
        const jsonMatch = text.match(/```json\s*([\sS]*?)\s*```/);
        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error("Could not find a valid JSON response from the model.");
        }
        
        const recipeData = JSON.parse(jsonMatch[1]);
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web) || [];
        
        return recipeData.map((r: Omit<Recipe, 'sources'>) => ({ ...r, sources }));
    };

    const findRecipes = async (searchQuery?: string) => {
        const pantryList = ingredients.map(i => i.name.toLowerCase());
        if (!searchQuery && pantryList.length === 0) {
            setError("Your pantry is empty. Add ingredients or use the search bar to find recipes.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setRecipes([]);
        setHasMore(false);

        const query = searchQuery || `recipes I can make with: ${ingredients.map(i => i.name).join(', ')}`;
        currentQueryRef.current = query;

        try {
            const newRecipes = await fetchRecipesFromAPI(query);
            setRecipes(newRecipes);
            setHasMore(newRecipes.length === RECIPES_PER_PAGE);
        } catch (err) {
            console.error("Error fetching recipes:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Sorry, I couldn't find recipes at the moment. Please try again later. Details: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreRecipes = async () => {
        if (isLoading || isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        setError(null);

        try {
            const newRecipes = await fetchRecipesFromAPI(currentQueryRef.current, true);
            setRecipes(prev => [...prev, ...newRecipes]);
            setHasMore(newRecipes.length === RECIPES_PER_PAGE);
        } catch (err) {
            console.error("Error fetching more recipes:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Could not load more recipes. Please try again. Details: ${errorMessage}`);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const addIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
        await addDoc(collection(db, "ingredients"), ingredient);
    };

    const removeIngredient = async (id: string) => {
        await deleteDoc(doc(db, "ingredients", id));
    };

    const updateIngredient = async (updatedIngredient: Ingredient) => {
        const { id, ...data } = updatedIngredient;
        await updateDoc(doc(db, "ingredients", id), data);
    };

    return (
        <div className="min-h-screen bg-brand-gray font-sans text-gray-800">
            <Header />
            <main className="container mx-auto p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 xl:col-span-4">
                        <Pantry
                            ingredients={ingredients}
                            onAdd={addIngredient}
                            onRemove={removeIngredient}
                            onUpdate={updateIngredient}
                            onFindRecipes={() => findRecipes()}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="lg:col-span-7 xl:col-span-8">
                        <RecipeList 
                            recipes={recipes} 
                            isLoading={isLoading} 
                            isLoadingMore={isLoadingMore}
                            hasMore={hasMore}
                            error={error} 
                            onSearch={findRecipes}
                            onLoadMore={loadMoreRecipes}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;