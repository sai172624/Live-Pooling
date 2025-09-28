import React, { useState } from 'react';

const StudentNameEntry = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Live Polling!</h1>
        <p className="landing-subtitle">
          Please enter your name to join the session
        </p>
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="role-button"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentNameEntry;
