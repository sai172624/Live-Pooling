import React, { useState } from 'react';

const PollAnswering = ({ poll, timeRemaining, onAnswerSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswerSubmit(selectedAnswer);
    }
  };

  const isTimeUp = timeRemaining <= 0;

  return (
    <div className="poll-container">
      <div className="poll-question">{poll?.question}</div>
      
      {!isTimeUp && (
        <div className="timer">
          Time Remaining: {timeRemaining}s
        </div>
      )}

      {isTimeUp && (
        <div className="timer" style={{ color: '#e53e3e' }}>
          Time's up! Poll will end soon.
        </div>
      )}

      <div className="poll-options">
        {poll?.options.map((option, index) => (
          <button
            key={index}
            className={`poll-option ${selectedAnswer === option ? 'selected' : ''} ${isTimeUp ? 'disabled' : ''}`}
            onClick={() => !isTimeUp && setSelectedAnswer(option)}
            disabled={isTimeUp}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        className="submit-answer-btn"
        onClick={handleSubmit}
        disabled={!selectedAnswer || isTimeUp}
      >
        {isTimeUp ? 'Time\'s Up!' : 'Submit Answer'}
      </button>
    </div>
  );
};

export default PollAnswering;
