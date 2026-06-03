import { useState, useEffect, useRef, useCallback } from "react";
import { generateQuestions } from "../services/aiService";

const ANSWER_KEYS = ["A", "B", "C", "D"];

export function useQuiz() {
  // ── Settings ──────────────────────────────────────────────────────
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(8);
  const [timerSecs, setTimerSecs] = useState(20);

  // ── Phase ─────────────────────────────────────────────────────────
  // "setup" | "loading" | "quiz" | "results"
  const [phase, setPhase] = useState("setup");

  // ── Quiz data ─────────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]); // { question, correct, chosen, correctIdx }

  // ── Per-question state ────────────────────────────────────────────
  const [selectedAnswer, setSelectedAnswer] = useState(null); // index chosen
  const [revealed, setRevealed] = useState(false); // answer revealed?
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // ── Error ─────────────────────────────────────────────────────────
  const [error, setError] = useState("");

  // ── Derived ───────────────────────────────────────────────────────
  const currentQuestion = questions[currentIdx] || null;
  const correctIdx = currentQuestion ? ANSWER_KEYS.indexOf(currentQuestion.answer) : -1;
  const progress = questions.length > 0 ? currentIdx / questions.length : 0;

  // ── Timer ─────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerSecs <= 0) return;
    setTimeLeft(timerSecs);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [timerSecs]);

  // Time up — auto-reveal
  useEffect(() => {
    if (phase === "quiz" && timerSecs > 0 && timeLeft === 0 && !revealed) {
      revealAnswer(null); // null = time up, no selection
    }
  }, [timeLeft, phase, revealed]);

  // Clean up timer on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  // ── Actions ───────────────────────────────────────────────────────
  const startQuiz = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to continue.");
      return;
    }
    setError("");
    setPhase("loading");

    try {
      const qs = await generateQuestions(topic.trim(), difficulty, questionCount);
      setQuestions(qs);
      setCurrentIdx(0);
      setScore(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setRevealed(false);
      setPhase("quiz");
      startTimer();
    } catch (err) {
      setError(err.message || "Failed to generate questions. Please try again.");
      setPhase("setup");
    }
  }, [topic, difficulty, questionCount, startTimer]);

  const revealAnswer = useCallback(
    (chosenIdx) => {
      stopTimer();
      setSelectedAnswer(chosenIdx);
      setRevealed(true);

      const isCorrect = chosenIdx !== null && chosenIdx === correctIdx;
      if (isCorrect) setScore((s) => s + 1);

      setAnswers((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          correct: isCorrect,
          chosen: chosenIdx,
          correctIdx,
        },
      ]);
    },
    [correctIdx, currentQuestion, stopTimer]
  );

  const selectAnswer = useCallback(
    (idx) => {
      if (revealed) return;
      revealAnswer(idx);
    },
    [revealed, revealAnswer]
  );

  const nextQuestion = useCallback(() => {
    const next = currentIdx + 1;
    if (next >= questions.length) {
      setPhase("results");
    } else {
      setCurrentIdx(next);
      setSelectedAnswer(null);
      setRevealed(false);
      startTimer();
    }
  }, [currentIdx, questions.length, startTimer]);

  const retryQuiz = useCallback(() => {
    setCurrentIdx(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setRevealed(false);
    setPhase("quiz");
    startTimer();
  }, [startTimer]);

  const newQuiz = useCallback(() => {
    stopTimer();
    setPhase("setup");
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setRevealed(false);
    setError("");
  }, [stopTimer]);

  return {
    // Settings
    topic, setTopic,
    difficulty, setDifficulty,
    questionCount, setQuestionCount,
    timerSecs, setTimerSecs,

    // Phase & error
    phase, error,

    // Quiz data
    questions, currentIdx, currentQuestion,
    correctIdx, score, answers, progress,

    // Per-question
    selectedAnswer, revealed, timeLeft,

    // Actions
    startQuiz, selectAnswer, nextQuestion, retryQuiz, newQuiz,
  };
}
