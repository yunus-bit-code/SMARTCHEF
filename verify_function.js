// const fetch = require('node-fetch'); // Using native fetch


async function testFunction() {
    const url = 'http://127.0.0.1:5001/smartchef-1deff/us-central1/recommendRecipes';
    const body = {
        data: {
            ingredients: ['chicken', 'tomato', 'onion'],
            language: 'English'
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        const text = await response.text();
        try {
            const json = JSON.parse(text);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Response is not JSON:", text);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testFunction();
