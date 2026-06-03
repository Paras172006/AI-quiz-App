import React from "react";
import { useQuiz } from "./hooks/useQuiz";
import TopicSelector from "./components/TopicSelector";
import LoadingScreen from "./components/LoadingScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";

export default function App() {
  const quiz = useQuiz();

  return (
    <div className="app-wrapper">
      {quiz.phase === "setup" && (
        <TopicSelector
          topic={quiz.topic}
          setTopic={quiz.setTopic}
          difficulty={quiz.difficulty}
          setDifficulty={quiz.setDifficulty}
          questionCount={quiz.questionCount}
          setQuestionCount={quiz.setQuestionCount}
          timerSecs={quiz.timerSecs}
          setTimerSecs={quiz.setTimerSecs}
          onStart={quiz.startQuiz}
          error={quiz.error}
        />
      )}

      {quiz.phase === "loading" && (
        <LoadingScreen topic={quiz.topic} />
      )}

      {quiz.phase === "quiz" && (
        <QuizScreen
          question={quiz.currentQuestion}
          currentIdx={quiz.currentIdx}
          total={quiz.questions.length}
          progress={quiz.progress}
          selectedAnswer={quiz.selectedAnswer}
          correctIdx={quiz.correctIdx}
          revealed={quiz.revealed}
          timeLeft={quiz.timeLeft}
          timerSecs={quiz.timerSecs}
          onSelect={quiz.selectAnswer}
          onNext={quiz.nextQuestion}
        />
      )}

      {quiz.phase === "results" && (
        <ResultScreen
          score={quiz.score}
          answers={quiz.answers}
          topic={quiz.topic}
          onRetry={quiz.retryQuiz}
          onNew={quiz.newQuiz}
        />
      )}
    </div>
  );
}
