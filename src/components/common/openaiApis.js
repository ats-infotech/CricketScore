export const generateSummary = async (stats) => {
    const res = await fetch('/api/generate-summary', {
    // const res = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
    });
    const data = await res.json();
    return data.result;
};
