import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPoll: null,
  pollState: 'waiting', // waiting, active, completed
  results: [],
  totalVotes: 0,
  timeRemaining: 0,
  pollHistory: [],
  isLoading: false,
  error: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.pollState = 'active';
      state.timeRemaining = action.payload?.timeLimit || 60;
      state.results = [];
      state.totalVotes = 0;
      state.error = null;
    },
    setPollState: (state, action) => {
      state.pollState = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload.results;
      state.totalVotes = action.payload.totalVotes;
      state.pollState = 'completed';
    },
    updateTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearPoll: (state) => {
      state.currentPoll = null;
      state.pollState = 'waiting';
      state.results = [];
      state.totalVotes = 0;
      state.timeRemaining = 0;
      state.error = null;
    },
  },
});

export const {
  setPoll,
  setPollState,
  setResults,
  updateTimeRemaining,
  setPollHistory,
  setLoading,
  setError,
  clearPoll,
} = pollSlice.actions;

export default pollSlice.reducer;
