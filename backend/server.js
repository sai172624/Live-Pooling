require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Atlas setup
const mongoUri = process.env.MONGODB_URI;
let mongoReady = false;
let PollModel = null;

if (mongoUri) {
  console.log('Attempting to connect to MongoDB Atlas...');
  mongoose
    .connect(mongoUri)
    .then(() => {
      mongoReady = true;
      const pollSchema = new mongoose.Schema(
        {
          pollId: { type: String, index: true },
          question: String,
          options: [String],
          results: [
            {
              option: String,
              votes: Number,
            },
          ],
          totalVotes: Number,
          createdAt: Date,
          completedAt: Date,
          viewableByTeacher: { type: Boolean, default: true },
        },
        { collection: 'polls' }
      );
      PollModel = mongoose.models.Poll || mongoose.model('Poll', pollSchema);
      console.log('✅ Connected to MongoDB Atlas successfully');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('Continuing without database - using in-memory storage');
    });
} else {
  console.log('No MONGODB_URI found - using in-memory storage only');
}

// In-memory storage for polls and students
let currentPoll = null;
let students = new Map(); // studentId -> { name, hasAnswered: boolean }
let pollResults = new Map(); // studentId -> answer
let pollHistory = [];

// Poll state management
const pollStates = {
  WAITING: 'waiting',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

let pollState = pollStates.WAITING;
let pollTimer = null;

// Routes
app.get('/api/status', (req, res) => {
  res.json({
    pollState,
    currentPoll,
    studentCount: students.size,
    answeredCount: Array.from(students.values()).filter(s => s.hasAnswered).length
  });
});

app.get('/api/results', (req, res) => {
  if (!currentPoll) {
    return res.json({ error: 'No active poll' });
  }
  
  const results = calculateResults();
  res.json({
    question: currentPoll.question,
    options: currentPoll.options,
    results,
    totalVotes: results.reduce((sum, option) => sum + option.votes, 0)
  });
});

app.get('/api/history', async (req, res) => {
  try {
    console.log('📊 Fetching poll history...');
    console.log('MongoDB ready:', mongoReady);
    console.log('PollModel exists:', !!PollModel);
    
    if (mongoReady && PollModel) {
      console.log('Querying MongoDB for poll history...');
      const docs = await PollModel.find({}).sort({ completedAt: -1 }).lean();
      console.log(`Found ${docs.length} polls in database`);
      
      const formattedDocs = docs.map((d) => ({
        id: d.pollId,
        question: d.question,
        options: d.options,
        results: d.results,
        totalVotes: d.totalVotes,
        createdAt: d.createdAt,
        completedAt: d.completedAt,
        viewableByTeacher: d.viewableByTeacher,
      }));
      
      return res.json(formattedDocs);
    }
    
    // Fallback to in-memory if DB is not configured
    console.log(`Using in-memory history: ${pollHistory.length} polls`);
    res.json(pollHistory);
  } catch (e) {
    console.error('❌ Failed to read poll history:', e);
    res.status(500).json({ error: 'Failed to load poll history' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Student joins
  socket.on('student-join', (data) => {
    const { name, studentId } = data;
    students.set(studentId, { name, hasAnswered: false });
    socket.join('students');
    socket.studentId = studentId;
    
    // Send current poll state to new student
    if (currentPoll && pollState === pollStates.ACTIVE) {
      socket.emit('poll-started', currentPoll);
    }
    
    // Notify teacher about new student
    io.to('teacher').emit('student-joined', {
      studentId,
      name,
      totalStudents: students.size
    });
    
    console.log(`Student joined: ${name} (${studentId})`);
  });

  // Teacher joins
  socket.on('teacher-join', () => {
    socket.join('teacher');
    socket.emit('teacher-connected', {
      pollState,
      currentPoll,
      students: Array.from(students.entries()).map(([id, data]) => ({ id, ...data }))
    });
    console.log('Teacher connected');
  });

  // Teacher creates poll
  socket.on('create-poll', (data) => {
    if (socket.rooms.has('teacher')) {
      // Check if new poll can be created
      if (pollState === pollStates.ACTIVE) {
        const allAnswered = Array.from(students.values()).every(s => s.hasAnswered);
        if (!allAnswered) {
          socket.emit('poll-error', { message: 'Cannot create new poll. Students are still answering current poll.' });
          return;
        }
      }

      // Reset previous poll data
      pollResults.clear();
      students.forEach(student => {
        student.hasAnswered = false;
      });

      // Create new poll
      currentPoll = {
        id: uuidv4(),
        question: data.question,
        options: data.options,
        createdAt: new Date(),
        timeLimit: data.timeLimit || 60
      };

      pollState = pollStates.ACTIVE;
      
      // Start timer
      if (pollTimer) clearTimeout(pollTimer);
      pollTimer = setTimeout(async () => {
        await endPoll();
      }, currentPoll.timeLimit * 1000);

      // Broadcast poll to all students
      io.to('students').emit('poll-started', currentPoll);
      
      // Notify teacher
      socket.emit('poll-created', currentPoll);
      
      console.log('Poll created:', currentPoll.question);
    }
  });

  // Student submits answer
  socket.on('submit-answer', async (data) => {
    if (socket.studentId && pollState === pollStates.ACTIVE) {
      const student = students.get(socket.studentId);
      if (student && !student.hasAnswered) {
        student.hasAnswered = true;
        pollResults.set(socket.studentId, data.answer);
        
        // Notify teacher about answer submission
        io.to('teacher').emit('answer-submitted', {
          studentId: socket.studentId,
          studentName: student.name,
          answer: data.answer,
          answeredCount: Array.from(students.values()).filter(s => s.hasAnswered).length,
          totalStudents: students.size
        });

        // Check if all students have answered
        const allAnswered = Array.from(students.values()).every(s => s.hasAnswered);
        if (allAnswered) {
          await endPoll();
        }
        
        console.log(`Answer submitted by ${student.name}: ${data.answer}`);
      }
    }
  });

  // Chat message
  socket.on('chat-message', (data) => {
    const message = {
      id: uuidv4(),
      senderId: socket.studentId || 'teacher',
      senderName: socket.studentId ? students.get(socket.studentId)?.name : 'Teacher',
      message: data.message,
      timestamp: new Date()
    };
    
    io.emit('chat-message', message);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    if (socket.studentId) {
      students.delete(socket.studentId);
      pollResults.delete(socket.studentId);
      
      // Notify teacher about student leaving
      io.to('teacher').emit('student-left', {
        studentId: socket.studentId,
        totalStudents: students.size
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

// Helper functions
function calculateResults() {
  if (!currentPoll) return [];
  
  const results = currentPoll.options.map(option => ({
    option,
    votes: 0
  }));
  
  pollResults.forEach(answer => {
    const result = results.find(r => r.option === answer);
    if (result) {
      result.votes++;
    }
  });
  
  return results;
}

async function endPoll() {
  if (pollState !== pollStates.ACTIVE) return;
  
  pollState = pollStates.COMPLETED;
  
  // Save to history (in-memory and DB)
  const results = calculateResults();
  const record = {
    id: currentPoll.id,
    question: currentPoll.question,
    options: currentPoll.options,
    results,
    totalVotes: results.reduce((sum, option) => sum + option.votes, 0),
    createdAt: currentPoll.createdAt,
    completedAt: new Date(),
    viewableByTeacher: true
  };
  pollHistory.push(record);
  console.log('💾 Saving poll to history...');
  console.log('MongoDB ready:', mongoReady);
  console.log('PollModel exists:', !!PollModel);
  
  if (mongoReady && PollModel) {
    try {
      console.log('Saving poll to MongoDB Atlas...');
      const savedPoll = await PollModel.create({
        pollId: record.id,
        question: record.question,
        options: record.options,
        results: record.results,
        totalVotes: record.totalVotes,
        createdAt: record.createdAt,
        completedAt: record.completedAt,
        viewableByTeacher: record.viewableByTeacher,
      });
      console.log('✅ Poll saved to MongoDB successfully:', savedPoll.pollId);
    } catch (e) {
      console.error('❌ Failed to persist poll to MongoDB:', e.message);
    }
  } else {
    console.log('📝 Poll saved to in-memory history only');
  }
  
  // Broadcast results to everyone
  io.emit('poll-completed', {
    question: currentPoll.question,
    options: currentPoll.options,
    results,
    totalVotes: results.reduce((sum, option) => sum + option.votes, 0)
  });
  
  // Reset for next poll
  currentPoll = null;
  pollResults.clear();
  students.forEach(student => {
    student.hasAnswered = false;
  });
  
  console.log('Poll completed and results broadcasted');
}

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
