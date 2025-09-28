import React from 'react';

const StudentList = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <div className="poll-container">
        <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Connected Students</h3>
        <p style={{ color: '#718096', textAlign: 'center' }}>No students connected yet</p>
      </div>
    );
  }

  return (
    <div className="poll-container">
      <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Connected Students ({students.length})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {students.map((student) => (
          <div
            key={student.id}
            style={{
              padding: '0.75rem',
              background: student.hasAnswered ? '#c6f6d5' : '#f7fafc',
              borderRadius: '8px',
              border: `1px solid ${student.hasAnswered ? '#9ae6b4' : '#e2e8f0'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: student.hasAnswered ? '#38a169' : '#a0aec0'
              }}
            />
            <span style={{ 
              fontWeight: '500', 
              color: student.hasAnswered ? '#2f855a' : '#4a5568' 
            }}>
              {student.name}
            </span>
            {student.hasAnswered && (
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#2f855a',
                marginLeft: 'auto'
              }}>
                ✓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
