import React, { useState, useEffect } from "react";

const MESSAGES = [
  "Generating your questions…",
  "Consulting the knowledge base…",
  "Crafting tricky questions…",
  "Mixing in some curveballs…",
  "Almost ready!",
];

export default function LoadingScreen({ topic }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card loader-card">
      <div className="spinner" />
      <p className="loader-msg">{MESSAGES[msgIdx]}</p>
      {topic && <p className="loader-topic">"{topic}"</p>}
    </div>
  );
}
