const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeEmotion(payload) {
    const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}
