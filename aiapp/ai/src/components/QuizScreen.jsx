import React from "react";

const KEYS = ["A", "B", "C", "D"];

function OptionButton({ label, text, state, onClick, disabled }) {
  // state: "default" | "correct" | "wrong" | "missed"
  return (
    <button
      className={`option option--${state}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="option-key">{label}</span>
      <span className="option-text">{text}</span>
    </button>
  );
}

export default function QuizScreen({
  question,
  currentIdx,
  total,
  progress,
  selectedAnswer,
  correctIdx,
  revealed,
  timeLeft,
  timerSecs,
  onSelect,
  onNext,
}) {
  if (!question) return null;

  const getOptionState = (i) => {
    if (!revealed) return "default";
    if (i === correctIdx) return "correct";
    if (i === selectedAnswer && i !== correctIdx) return "wrong";
    return "default";
  };

  const isUrgent = timerSecs > 0 && timeLeft <= 5 && !revealed;

  return (
    <div className="card">
      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Meta row */}
      <div className="quiz-meta">
        <span className="q-count">Question {currentIdx + 1} of {total}</span>
        {timerSecs > 0 && (
          <span className={`q-timer ${isUrgent ? "urgent" : ""}`}>
            ⏱ {timeLeft}s
          </span>
        )}
      </div>

      {/* Question */}
      <div className="question-card">
        <p className="question-text">{question.question}</p>
      </div>

      {/* Options */}
      <div className="options">
        {question.options.map((opt, i) => (
          <OptionButton
            key={i}
            label={KEYS[i]}
            text={opt}
            state={getOptionState(i)}
            onClick={() => onSelect(i)}
            disabled={revealed}
          />
        ))}
      </div>

      {/* Explanation */}
      {revealed && question.explanation && (
        <div className="explanation">
          {selectedAnswer === null && <strong>⏱ Time's up! </strong>}
          {question.explanation}
        </div>
      )}

      {/* Next button */}
      {revealed && (
        <div className="actions">
          <button className="btn btn-primary" onClick={onNext}>
            {currentIdx + 1 >= total ? "See results →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
