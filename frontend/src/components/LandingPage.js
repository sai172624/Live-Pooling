import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Live Polling System</h1>
        <p className="landing-subtitle">
          Real-time interactive polling for teachers and students
        </p>
        <div className="role-buttons">
          <button 
            className="role-button"
            onClick={() => navigate('/teacher')}
          >
            👨‍🏫 Teacher Dashboard
          </button>
          <button 
            className="role-button"
            onClick={() => navigate('/student')}
          >
            👨‍🎓 Student Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
