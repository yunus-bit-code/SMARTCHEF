const apiKey = 'AIzaSyBuz9iki62hULs1n1kshkVEMJIkiGYsttg';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

import fs from 'fs';

async function listModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log(data.models.map(m => m.name).join(' '));
        } else {
            console.log('No models found in the response.');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
