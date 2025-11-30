const apiKey = 'AIzaSyBuz9iki62hULs1n1kshkVEMJIkiGYsttg';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const prompt = `
You are a recipe assistant. Your task is to find 6 diverse recipes based on the user's pantry.
The user has the following ingredients: chicken.

Please provide the response in English.

Your response MUST be a single, valid JSON array of recipe objects, enclosed in a JSON markdown block.
Each recipe object must have:
{
  "title": "Recipe Title",
  "description": "Short description",
  "cuisine": "Cuisine type",
  "cookTime": 60,
  "ingredients": [
    { "name": "Ingredient Name", "quantity": "Quantity", "inPantry": true/false }
  ],
  "instructions": ["Step 1", "Step 2"]
}
`;

async function testGemini() {
    try {
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

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log("=== FULL RESPONSE ===");
        console.log(JSON.stringify(result, null, 2));
        console.log("\n=== TEXT ONLY ===");
        console.log(text);

        // Try to find JSON
        const jsonMatch1 = text.match(/```json\s*([\s\S]*?)\s*```/);
        console.log("\n=== Pattern 1 (```json) Match ===");
        console.log(jsonMatch1 ? "FOUND" : "NOT FOUND");

        const jsonMatch2 = text.match(/```\s*([\s\S]*?)\s*```/);
        console.log("\n=== Pattern 2 (```) Match ===");
        console.log(jsonMatch2 ? "FOUND" : "NOT FOUND");

        const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        console.log("\n=== Pattern 3 (Direct Array) Match ===");
        console.log(arrayMatch ? "FOUND" : "NOT FOUND");

    } catch (error) {
        console.error('Error:', error);
    }
}

testGemini();
