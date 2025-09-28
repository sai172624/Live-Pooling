import React from 'react';

const PollCreation = ({ pollData, setPollData, onCreatePoll, canCreatePoll }) => {
  const addOption = () => {
    if (pollData.options.length < 6) {
      setPollData({
        ...pollData,
        options: [...pollData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (pollData.options.length > 2) {
      const newOptions = pollData.options.filter((_, i) => i !== index);
      setPollData({
        ...pollData,
        options: newOptions
      });
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData({
      ...pollData,
      options: newOptions
    });
  };

  const isFormValid = () => {
    return (
      pollData.question.trim() &&
      pollData.options.filter(opt => opt.trim()).length >= 2 &&
      canCreatePoll
    );
  };

  return (
    <div className="poll-creation">
      <h2 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>Create New Poll</h2>
      <div className="poll-form">
        <div className="form-group">
          <label className="form-label">Question</label>
          <input
            type="text"
            className="form-input"
            value={pollData.question}
            onChange={(e) => setPollData({ ...pollData, question: e.target.value })}
            placeholder="Enter your poll question"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Answer Options</label>
          <div className="options-container">
            {pollData.options.map((option, index) => (
              <div key={index} className="option-input">
                <input
                  type="text"
                  className="form-input"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {pollData.options.length > 2 && (
                  <button
                    type="button"
                    className="remove-option"
                    onClick={() => removeOption(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {pollData.options.length < 6 && (
              <button
                type="button"
                className="add-option"
                onClick={addOption}
              >
                + Add Option
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Time Limit (seconds)</label>
          <input
            type="number"
            className="form-input"
            value={pollData.timeLimit}
            onChange={(e) => setPollData({ ...pollData, timeLimit: parseInt(e.target.value) || 60 })}
            min="10"
            max="300"
          />
        </div>

        <button
          className="create-poll-btn"
          onClick={onCreatePoll}
          disabled={!isFormValid()}
        >
          {canCreatePoll ? 'Create Poll' : 'Cannot Create Poll - Students Still Answering'}
        </button>
      </div>
    </div>
  );
};

export default PollCreation;
