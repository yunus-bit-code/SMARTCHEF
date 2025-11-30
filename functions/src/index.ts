import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const recommendRecipes = functions.https.onCall(async (data, context) => {
    try {
        const { ingredients, language } = data;

        if (!ingredients || !Array.isArray(ingredients)) {
            throw new functions.https.HttpsError("invalid-argument", "Invalid ingredients list.");
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set.");
            throw new functions.https.HttpsError("internal", "Server configuration error.");
        }

        const pantryList = ingredients.join(", ");
        const prompt = `
      You are a recipe assistant. Your task is to find 6 diverse recipes based on the user's pantry.
      The user has the following ingredients: ${pantryList}.
      
      Please provide the response in ${language || "English"}.

      Your response MUST be a single, valid JSON array of recipe objects, enclosed in a JSON markdown block.
      Each recipe object must have:
      {
        "title": "Recipe Title",
        "description": "Short description",
        "cuisine": "Cuisine type",
        "cookTime": 60, // in minutes
        "ingredients": [
          { "name": "Ingredient Name", "quantity": "Quantity", "inPantry": true/false }
        ],
        "instructions": ["Step 1", "Step 2"]
      }
    `;

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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("No content generated.");
        }

        const jsonMatch = text.match(/```json\s*([\sS]*?)\s*```/);
        if (!jsonMatch || !jsonMatch[1]) {
            throw new functions.https.HttpsError("internal", "Invalid response format from AI.");
        }

        const recipes = JSON.parse(jsonMatch[1]);
        return { recipes };

    } catch (error: any) {
        console.error("Error generating recipes:", error);
        throw new functions.https.HttpsError("internal", error.message || "Internal Server Error");
    }
});
