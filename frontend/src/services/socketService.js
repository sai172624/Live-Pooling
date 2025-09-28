import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5001');
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Student methods
  joinAsStudent(name, studentId) {
    if (this.socket) {
      this.socket.emit('student-join', { name, studentId });
    }
  }

  submitAnswer(answer) {
    if (this.socket) {
      this.socket.emit('submit-answer', { answer });
    }
  }

  // Teacher methods
  joinAsTeacher() {
    if (this.socket) {
      this.socket.emit('teacher-join');
    }
  }

  createPoll(pollData) {
    if (this.socket) {
      this.socket.emit('create-poll', pollData);
    }
  }

  // Chat methods
  sendChatMessage(message) {
    if (this.socket) {
      this.socket.emit('chat-message', { message });
    }
  }

  // Event listeners
  onPollStarted(callback) {
    if (this.socket) {
      this.socket.on('poll-started', callback);
    }
  }

  onPollCompleted(callback) {
    if (this.socket) {
      this.socket.on('poll-completed', callback);
    }
  }

  onAnswerSubmitted(callback) {
    if (this.socket) {
      this.socket.on('answer-submitted', callback);
    }
  }

  onStudentJoined(callback) {
    if (this.socket) {
      this.socket.on('student-joined', callback);
    }
  }

  onStudentLeft(callback) {
    if (this.socket) {
      this.socket.on('student-left', callback);
    }
  }

  onTeacherConnected(callback) {
    if (this.socket) {
      this.socket.on('teacher-connected', callback);
    }
  }

  onPollError(callback) {
    if (this.socket) {
      this.socket.on('poll-error', callback);
    }
  }

  onPollCreated(callback) {
    if (this.socket) {
      this.socket.on('poll-created', callback);
    }
  }

  onChatMessage(callback) {
    if (this.socket) {
      this.socket.on('chat-message', callback);
    }
  }

  // Remove listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();
