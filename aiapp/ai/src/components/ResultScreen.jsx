import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { saveQuizScore } from '../services/aiService';

const ResultScreen = ({ score = 0, totalQuestions = 5, topic = "Quiz", onReset }) => {
  // FIX: Agar parent se totalQuestions galat aaye toh crash/empty na ho
  const total = parseInt(totalQuestions) || 5; 
  const correctAnswers = parseInt(score) || 0;
  const incorrectAnswers = total - correctAnswers;
  
  // Percentage calculate karo center me dikhane ke liye
  const percentage = Math.round((correctAnswers / total) * 100);

  const data = [
    { name: 'Correct', value: correctAnswers },
    { name: 'Incorrect', value: incorrectAnswers },
  ];

  // 🚀 Premium Colors: Glowing Green aur Faint Red
  const COLORS = ['#10b981', 'rgba(244, 63, 94, 0.15)']; 

  useEffect(() => {
    saveQuizScore({
      topic,
      totalQuestions: total,
      score: correctAnswers,
      timestamp: new Date().toLocaleDateString()
    });
  }, [score, total, topic]);

  // Dynamic feedback message
  let feedbackMessage = "Good effort!";
  if (percentage >= 80) feedbackMessage = "Outstanding! 🏆";
  else if (percentage >= 50) feedbackMessage = "Great job! 👍";
  else feedbackMessage = "Keep learning! 📚";

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
      
      <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>Quiz Completed</h2>
      <p className="sub" style={{ marginBottom: '24px', opacity: 0.8 }}>Topic: {topic}</p>

      {/* 🚀 MODERN DONUT CHART CONTAINER */}
      <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 24px auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75} // Donut ki thickness
              outerRadius={95}
              paddingAngle={8} // Items ke beech ka gap
              dataKey="value"
              stroke="none"
              cornerRadius={12} // 🚀 Rounded ends for premium look
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{
                    filter: index === 0 ? 'drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.4))' : 'none'
                  }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '10px',
                color: '#fff',
                backdropFilter: 'blur(10px)'
              }} 
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 🚀 CENTER PERCENTAGE TEXT */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f8fafc', lineHeight: '1' }}>
            {percentage}%
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            Score
          </span>
        </div>
      </div>

      <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '12px' }}>
        {feedbackMessage}
      </h3>
      
      <p style={{ fontSize: '1.05rem', color: '#94a3b8', marginBottom: '30px' }}>
        You scored <strong style={{ color: '#10b981', fontSize: '1.3rem' }}>{correctAnswers}</strong> out of <strong style={{ color: '#f8fafc', fontSize: '1.3rem' }}>{total}</strong>
      </p>

      {/* Button using our premium CSS class */}
      <button onClick={onReset} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
        Take Another Quiz
      </button>

    </div>
  );
};

export default ResultScreen;