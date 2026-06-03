// Local backend ka URL (Development ke liye)
// "I modularized the architecture by shifting the core AI prompting and Google Gemini API integration to a secure Node.js/Express proxy layer. This prevents API Key exposure on the client-side client bundle and establishes a baseline for implementing user-based rate limiting."

const BACKEND_URL = 'http://localhost:5000/api';

export async function generateQuestions(topic, difficulty, count) {
  try {
    const response = await fetch(`${BACKEND_URL}/generate-quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, count }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error || `API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
      throw new Error("No questions returned. Try a different topic.");
    }

    return result.data;
  } catch (error) {
    console.error("Frontend Error:", error);
    throw error;
  }
}

// 🚀 Extra Resume Score-Saving Feature
export const saveQuizScore = async (scoreData) => {
  try {
    const response = await fetch(`${BACKEND_URL}/save-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error saving score:", error);
  }
};