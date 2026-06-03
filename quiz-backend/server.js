import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Agar node version purana hai toh 'npm i node-fetch' kar lena, v18+ me zaroorat nahi hai

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory array history maintain karne ke liye
let quizHistory = [];

app.post('/api/generate-quiz', async (req, res) => {
  const { topic, difficulty, count } = req.body;
  
  // Backend environment variable se key uthayenge
  const API_KEY = process.env.GEMINI_API_KEY; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

  // 🚀 STRICT PROMPT (Updated)
  const prompt = `Generate exactly ${count} multiple choice quiz questions about "${topic}".
Difficulty level: ${difficulty}.
Each question must have exactly 4 answer options.

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON array.
2. DO NOT wrap the response in \`\`\`json or any markdown blocks. 
3. Escape all internal double quotes.
4. Use this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "A",
    "explanation": "Brief explanation."
  }
]
The "answer" field must be exactly one letter: A, B, C, or D.`;

  try {
    const googleResponse = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 2500, // 🚀 Increased from 2000 to prevent cut-offs
          responseMimeType: "application/json" 
        },
      }),
    });

    if (!googleResponse.ok) {
      const errData = await googleResponse.json().catch(() => ({}));
      return res.status(500).json({ success: false, error: errData?.error?.message || "Google API Error" });
    }

    const data = await googleResponse.json();
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    // 🚀 THE FIX: String Cleaner (Removes markdown tags if Gemini still sends them)
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const questions = JSON.parse(rawText);

    res.json({ success: true, data: questions });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ success: false, error: "Failed to parse AI response. Please try again." });
  }
});

// Endpoint: Score Save karne ke liye
app.post('/api/save-score', (req, res) => {
  const { topic, totalQuestions, score, timestamp } = req.body;
  const newRecord = { id: Date.now(), topic, totalQuestions, score, timestamp };
  quizHistory.push(newRecord);
  res.json({ success: true, history: quizHistory });
});

// Endpoint: Purani history fetch karne ke liye
app.get('/api/history', (req, res) => {
  res.json({ success: true, history: quizHistory });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Secure Backend running on port ${PORT}`));