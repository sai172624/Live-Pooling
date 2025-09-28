import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import socketService from '../services/socketService';
import {
  setPoll,
  setPollState,
  setResults,
  updateTimeRemaining,
  setError,
} from '../store/slices/pollSlice';
import {
  setStudentId,
  setName,
  setHasAnswered,
  setConnected,
  setAnswer,
  resetStudent,
} from '../store/slices/studentSlice';
import {
  addMessage,
  toggleChat,
} from '../store/slices/chatSlice';
import StudentNameEntry from './StudentNameEntry';
import PollAnswering from './PollAnswering';
import PollResults from './PollResults';
import ChatPopup from './ChatPopup';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPoll, pollState, results, timeRemaining } = useSelector(state => state.poll);
  const { studentId, name, hasAnswered, isConnected, answer } = useSelector(state => state.student);
  const { isOpen: chatOpen } = useSelector(state => state.chat);
  const [showNameEntry, setShowNameEntry] = useState(!name);

  useEffect(() => {
    // Check if student ID exists in localStorage
    let existingStudentId = localStorage.getItem('studentId');
    if (!existingStudentId) {
      existingStudentId = uuidv4();
      localStorage.setItem('studentId', existingStudentId);
    }
    dispatch(setStudentId(existingStudentId));

    // Check if name exists in localStorage
    const existingName = localStorage.getItem('studentName');
    if (existingName) {
      dispatch(setName(existingName));
      setShowNameEntry(false);
    }

    // Connect to socket
    const socket = socketService.connect();
    
    // Set up event listeners
    socketService.onPollStarted((poll) => {
      dispatch(setPoll(poll));
      dispatch(setPollState('active'));
      dispatch(resetStudent());
      
      // Start timer
      let timeLeft = poll.timeLimit;
      dispatch(updateTimeRemaining(timeLeft));
      
      const timer = setInterval(() => {
        timeLeft -= 1;
        dispatch(updateTimeRemaining(timeLeft));
        
        if (timeLeft <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    });

    socketService.onPollCompleted((data) => {
      dispatch(setResults(data));
      dispatch(setPollState('completed'));
    });

    socketService.onChatMessage((message) => {
      dispatch(addMessage(message));
    });

    // Cleanup on unmount
    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, [dispatch]);

  // Auto-join as student if name already exists in localStorage
  useEffect(() => {
    if (studentId && name && !showNameEntry && !isConnected) {
      socketService.joinAsStudent(name, studentId);
      dispatch(setConnected(true));
    }
  }, [studentId, name, showNameEntry, isConnected, dispatch]);

  const handleNameSubmit = (studentName) => {
    dispatch(setName(studentName));
    localStorage.setItem('studentName', studentName);
    setShowNameEntry(false);
    
    // Join as student
    socketService.joinAsStudent(studentName, studentId);
    dispatch(setConnected(true));
  };

  const handleAnswerSubmit = (selectedAnswer) => {
    dispatch(setAnswer(selectedAnswer));
    dispatch(setHasAnswered(true));
    socketService.submitAnswer(selectedAnswer);
  };

  const handleSendMessage = (message) => {
    socketService.sendChatMessage(message);
  };

  // Fallback UI when name exists but socket isn't connected yet
  if (!showNameEntry && !isConnected) {
    return (
      <div className="dashboard">
        <div className="student-info">
          <h2 className="student-name">Welcome, {name || 'Student'}!</h2>
          <p className="student-status">Connecting to server...</p>
          {name && (
            <button
              className="role-button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                if (studentId && name) {
                  socketService.joinAsStudent(name, studentId);
                  dispatch(setConnected(true));
                } else {
                  setShowNameEntry(true);
                }
              }}
            >
              Retry Join
            </button>
          )}
        </div>
      </div>
    );
  }

  if (showNameEntry) {
    return <StudentNameEntry onSubmit={handleNameSubmit} />;
  }

  return (
    <div className="dashboard">
      <div className="student-info">
        <h2 className="student-name">Welcome, {name}!</h2>
        <p className="student-status">
          {pollState === 'waiting' && 'Waiting for a poll to start...'}
          {pollState === 'active' && !hasAnswered && 'Answer the poll below'}
          {pollState === 'active' && hasAnswered && 'You have answered. Waiting for results...'}
          {pollState === 'completed' && 'Poll completed. View results below.'}
        </p>
      </div>

      {pollState === 'active' && !hasAnswered && (
        <PollAnswering
          poll={currentPoll}
          timeRemaining={timeRemaining}
          onAnswerSubmit={handleAnswerSubmit}
        />
      )}

      {pollState === 'active' && hasAnswered && (
        <div className="poll-container">
          <div className="poll-question">{currentPoll?.question}</div>
          <div className="timer">Time Remaining: {timeRemaining}s</div>
          <p style={{ textAlign: 'center', color: '#718096' }}>
            You answered: <strong>{answer}</strong>
          </p>
          <p style={{ textAlign: 'center', color: '#718096', marginTop: '1rem' }}>
            Waiting for other students to finish...
          </p>
        </div>
      )}

      {pollState === 'completed' && (
        <PollResults
          poll={currentPoll}
          results={results}
          pollState={pollState}
          studentAnswer={answer}
        />
      )}

      {pollState === 'waiting' && (
        <div className="poll-container">
          <div className="poll-question">No active poll</div>
          <p style={{ textAlign: 'center', color: '#718096' }}>
            Wait for your teacher to create a new poll.
          </p>
        </div>
      )}

      <ChatPopup
        isOpen={chatOpen}
        onToggle={() => dispatch(toggleChat())}
        onSendMessage={handleSendMessage}
        senderName={name}
      />

      <button
        className="chat-toggle"
        onClick={() => dispatch(toggleChat())}
        title="Toggle Chat"
      >
        💬
      </button>
    </div>
  );
};

export default StudentDashboard;
