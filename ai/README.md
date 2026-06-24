# AI Quiz App

A React quiz app that generates questions using Claude (Anthropic API).

## Project structure

```
quiz-app/
├── src/
│   ├── components/
│   │   ├── TopicSelector.jsx   # Topic, difficulty, count, timer settings
│   │   ├── QuizScreen.jsx      # Question + answer options + timer
│   │   ├── ResultScreen.jsx    # Score, breakdown, retry
│   │   └── LoadingScreen.jsx   # Shown while AI generates questions
│   ├── hooks/
│   │   └── useQuiz.js          # All quiz state and logic
│   ├── services/
│   │   └── aiService.js        # Anthropic API call
│   ├── App.jsx                 # Root component (phase switcher)
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your API key**
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_ANTHROPIC_API_KEY=your_key_here
   ```
   Get your key from [console.anthropic.com](https://console.anthropic.com).

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## ⚠️ Security note

This app calls the Anthropic API directly from the browser (fine for local dev).  
For a public deployment, proxy the API call through your own backend so your key is never exposed.
