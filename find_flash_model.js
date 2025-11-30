const apiKey = 'AIzaSyBuz9iki62hULs1n1kshkVEMJIkiGYsttg';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function findFlashModel() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            const flashModel = data.models.find(m => m.name.includes('flash'));
            if (flashModel) {
                console.log('FOUND_MODEL:' + flashModel.name);
            } else {
                console.log('NO_FLASH_MODEL_FOUND');
                console.log('AVAILABLE_MODELS:' + data.models.map(m => m.name).join(','));
            }
        } else {
            console.log('NO_MODELS_RETURNED');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

findFlashModel();
