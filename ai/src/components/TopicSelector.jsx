import React from "react";

const TOPICS = [
  "Ancient Rome", "Human Biology", "JavaScript",
  "Space Exploration", "Cricket", "Indian History",
];

const DIFFICULTIES = ["easy", "medium", "hard"];
const COUNTS = [5, 8, 10];
const TIMERS = [
  { label: "No timer", val: 0 },
  { label: "20 sec", val: 20 },
  { label: "30 sec", val: 30 },
  { label: "45 sec", val: 45 },
];

function PillGroup({ options, active, onSelect, keyFn, labelFn }) {
  return (
    <div className="pill-group">
      {options.map((opt) => {
        const val = keyFn(opt);
        return (
          <button
            key={val}
            className={`pill ${active === val ? "active" : ""}`}
            onClick={() => onSelect(val)}
          >
            {labelFn(opt)}
          </button>
        );
      })}
    </div>
  );
}

export default function TopicSelector({
  topic, setTopic,
  difficulty, setDifficulty,
  questionCount, setQuestionCount,
  timerSecs, setTimerSecs,
  onStart, error,
}) {
  return (
    <div className="card">
      <p className="tag">AI Quiz</p>
      <h1>What do you want to be tested on?</h1>
      <p className="sub">Enter a topic and Gemini will generate questions just for you.</p>

      {error && <div className="error-box">{error}</div>}

      {/* Topic */}
      <div className="field">
        <label>Topic</label>
        <input
          type="text"
          placeholder="e.g. The Solar System, World War II, Python basics…"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onStart()}
        />
       <div className="topic-chips">
  {TOPICS.map((t) => (
    <button 
      key={t} 
      type="button" //  Add this line
      className="chip" 
      onClick={(e) => {
        e.preventDefault(); // Loop/Extra render rokne ke liye
        setTopic(t);
      }}
    >
      {t}
    </button>
  ))}
</div>
      </div>

      {/* Difficulty */}
      <div className="field">
        <label>Difficulty</label>
        <PillGroup
          options={DIFFICULTIES}
          active={difficulty}
          onSelect={setDifficulty}
          keyFn={(d) => d}
          labelFn={(d) => d.charAt(0).toUpperCase() + d.slice(1)}
        />
      </div>

      {/* Count */}
      <div className="field">
        <label>Number of questions</label>
        <PillGroup
          options={COUNTS}
          active={questionCount}
          onSelect={setQuestionCount}
          keyFn={(c) => c}
          labelFn={(c) => c}
        />
      </div>

      {/* Timer */}
      <div className="field">
        <label>Timer per question</label>
        <PillGroup
          options={TIMERS}
          active={timerSecs}
          onSelect={setTimerSecs}
          keyFn={(t) => t.val}
          labelFn={(t) => t.label}
        />
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        ✦ Generate quiz
      </button>
    </div>
  );
}
