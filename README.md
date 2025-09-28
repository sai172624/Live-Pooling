# Live Polling System

A real-time interactive polling system for teachers and students built with React, Redux, Express.js, and Socket.io.

## Features

### Teacher Features
- ✅ Create new polls with custom questions and options
- ✅ View live polling results in real-time
- ✅ Monitor student participation and answers
- ✅ Set custom time limits for polls (10-300 seconds)
- ✅ Chat with students during sessions
- ✅ View poll history

### Student Features
- ✅ Enter name on first visit (unique per tab)
- ✅ Submit answers to active polls
- ✅ View live polling results after submission
- ✅ 60-second default timer (configurable by teacher)
- ✅ Chat with teacher and other students

### Technical Features
- ✅ Real-time communication with Socket.io
- ✅ Redux state management
- ✅ Responsive design
- ✅ Modern UI with smooth animations
- ✅ Error handling and validation
- ✅ Local storage for student identification

## Technology Stack

- **Frontend**: React 18, Redux Toolkit, React Router
- **Backend**: Express.js, Socket.io
- **Styling**: CSS3 with modern design patterns
- **Real-time**: Socket.io for live updates

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live-polling-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Start Backend (Terminal 1):**
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:5000

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

**Open the application:**
- Navigate to http://localhost:3000
- Choose "Teacher Dashboard" or "Student Dashboard"
- For students: Enter your name to join
- For teachers: Start creating polls immediately

## Usage

### For Teachers
1. Click "Teacher Dashboard" on the landing page
2. Create a new poll by entering a question and options
3. Set a time limit (default: 60 seconds)
4. Click "Create Poll" to start the poll
5. Monitor student responses in real-time
6. View results when the poll completes
7. Use the chat feature to communicate with students

### For Students
1. Click "Student Dashboard" on the landing page
2. Enter your name (stored locally for future visits)
3. Wait for a poll to be created by the teacher
4. Answer the poll within the time limit
5. View live results after submitting
6. Use the chat feature to communicate

## API Endpoints

### Backend API
- `GET /api/status` - Get current poll status
- `GET /api/results` - Get current poll results
- `GET /api/history` - Get poll history

### Socket Events
- `student-join` - Student joins the session
- `teacher-join` - Teacher joins the session
- `create-poll` - Teacher creates a new poll
- `submit-answer` - Student submits an answer
- `chat-message` - Send a chat message

## Deployment

### Backend Deployment (Heroku)
1. Create a new Heroku app
2. Set environment variables if needed
3. Deploy the backend folder
4. Update the frontend to use the production backend URL

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the build folder to your hosting service
3. Set environment variables for the backend URL

## Project Structure

```
live-polling-system/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # Socket.io service
│   │   └── App.js         # Main App component
│   └── package.json       # Frontend dependencies
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue in the repository.
