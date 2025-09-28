import React, { useEffect, useState } from 'react';

const PollHistory = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5001';
      const response = await fetch(`${baseUrl}/api/history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch poll history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#2d3748', margin: 0 }}>Poll History</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#718096'
            }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            Loading poll history...
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            No polls completed yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {history.map((poll, index) => (
              <div key={poll.id || index} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                background: '#f7fafc'
              }}>
                <h3 style={{ 
                  color: '#2d3748', 
                  marginBottom: '1rem',
                  fontSize: '1.1rem'
                }}>
                  {poll.question}
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Completed:</strong> {formatDate(poll.completedAt)}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Total Votes:</strong> {poll.totalVotes}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {poll.results.map((result, resultIndex) => (
                    <div key={resultIndex} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ flex: 1, fontWeight: '500' }}>
                        {result.option}
                      </div>
                      <div style={{
                        flex: 2,
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #667eea, #764ba2)',
                            borderRadius: '4px',
                            width: `${poll.totalVotes > 0 ? (result.votes / poll.totalVotes) * 100 : 0}%`,
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                      <div style={{
                        fontWeight: '600',
                        color: '#667eea',
                        minWidth: '40px',
                        textAlign: 'right'
                      }}>
                        {result.votes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollHistory;
