import React from 'react';

const PollResults = ({ poll, results, pollState, answeredCount, totalStudents, studentAnswer }) => {
  if (!poll || !results) {
    return null;
  }

  const maxVotes = Math.max(...results.map(r => r.votes), 1);

  return (
    <div className="results-container">
      <h2 className="results-title">{poll.question}</h2>
      
      {pollState === 'active' && (
        <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#718096' }}>
          {answeredCount} of {totalStudents} students have answered
        </div>
      )}

      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <div className="result-option">{result.option}</div>
            <div className="result-bar">
              <div
                className="result-fill"
                style={{
                  width: `${(result.votes / maxVotes) * 100}%`
                }}
              />
            </div>
            <div className="result-votes">
              {result.votes} vote{result.votes !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>

      {studentAnswer && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#e6fffa', 
          borderRadius: '8px',
          textAlign: 'center',
          color: '#2c7a7b'
        }}>
          <strong>Your answer:</strong> {studentAnswer}
        </div>
      )}

      <div style={{ 
        marginTop: '1rem', 
        textAlign: 'center', 
        color: '#718096',
        fontSize: '0.875rem'
      }}>
        Total votes: {results.reduce((sum, r) => sum + r.votes, 0)}
      </div>
    </div>
  );
};

export default PollResults;
