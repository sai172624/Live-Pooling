import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socketService';
import {
  setPoll,
  setPollState,
  setResults,
  setPollHistory,
  setError,
  clearPoll,
} from '../store/slices/pollSlice';
import {
  setConnected,
  setStudents,
  addStudent,
  removeStudent,
  updateAnsweredCount,
  setCanCreatePoll,
} from '../store/slices/teacherSlice';
import {
  addMessage,
  toggleChat,
  setChatOpen,
} from '../store/slices/chatSlice';
import PollCreation from './PollCreation';
import PollResults from './PollResults';
import StudentList from './StudentList';
import ChatPopup from './ChatPopup';
import PollHistory from './PollHistory';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPoll, pollState, results, pollHistory } = useSelector(state => state.poll);
  const { isConnected, students, answeredCount, totalStudents, canCreatePoll } = useSelector(state => state.teacher);
  const { isOpen: chatOpen } = useSelector(state => state.chat);
  const [pollData, setPollData] = useState({
    question: '',
    options: ['', ''],
    timeLimit: 60
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();
    
    // Join as teacher
    socketService.joinAsTeacher();

    // Set up event listeners
    socketService.onTeacherConnected((data) => {
      dispatch(setConnected(true));
      dispatch(setStudents(data.students || []));
      dispatch(setPoll(data.currentPoll));
      dispatch(setPollState(data.pollState));
    });

    socketService.onStudentJoined((data) => {
      dispatch(addStudent({ id: data.studentId, name: data.name, hasAnswered: false }));
      dispatch(updateAnsweredCount({ answeredCount: data.answeredCount, totalStudents: data.totalStudents }));
    });

    socketService.onStudentLeft((data) => {
      dispatch(removeStudent(data.studentId));
      dispatch(updateAnsweredCount({ answeredCount: data.answeredCount, totalStudents: data.totalStudents }));
    });

    socketService.onAnswerSubmitted((data) => {
      dispatch(updateAnsweredCount({ answeredCount: data.answeredCount, totalStudents: data.totalStudents }));
    });

    socketService.onPollCreated((poll) => {
      dispatch(setPoll(poll));
      dispatch(setPollState('active'));
      dispatch(setCanCreatePoll(false));
    });

    socketService.onPollCompleted((data) => {
      dispatch(setResults(data));
      dispatch(setPollState('completed'));
      dispatch(setCanCreatePoll(true));
    });

    socketService.onPollError((error) => {
      dispatch(setError(error.message));
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

  const handleCreatePoll = () => {
    if (pollData.question.trim() && pollData.options.filter(opt => opt.trim()).length >= 2) {
      const validOptions = pollData.options.filter(opt => opt.trim());
      socketService.createPoll({
        question: pollData.question.trim(),
        options: validOptions,
        timeLimit: pollData.timeLimit
      });
      
      // Reset form
      setPollData({
        question: '',
        options: ['', ''],
        timeLimit: 60
      });
    }
  };

  const handleSendMessage = (message) => {
    socketService.sendChatMessage(message);
  };

  if (!isConnected) {
    return (
      <div className="dashboard">
        <div className="loading">Connecting to server...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
        <p className="dashboard-subtitle">
          Create polls and monitor student responses in real-time
        </p>
      </div>

      <div className="teacher-stats">
        <div className="stat-card">
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{answeredCount}</div>
          <div className="stat-label">Answered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pollHistory.length}</div>
          <div className="stat-label">Polls Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pollState}</div>
          <div className="stat-label">Current Status</div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setShowHistory(true)}>
          <div className="stat-value">📊</div>
          <div className="stat-label">View History</div>
        </div>
      </div>

      <StudentList students={students} />

      {pollState === 'waiting' || pollState === 'completed' ? (
        <PollCreation
          pollData={pollData}
          setPollData={setPollData}
          onCreatePoll={handleCreatePoll}
          canCreatePoll={canCreatePoll}
        />
      ) : (
        <PollResults
          poll={currentPoll}
          results={results}
          pollState={pollState}
          answeredCount={answeredCount}
          totalStudents={totalStudents}
        />
      )}

      <ChatPopup
        isOpen={chatOpen}
        onToggle={() => dispatch(toggleChat())}
        onSendMessage={handleSendMessage}
        senderName="Teacher"
      />

      <PollHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
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

export default TeacherDashboard;
