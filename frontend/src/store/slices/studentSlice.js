import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  studentId: null,
  name: '',
  hasAnswered: false,
  isConnected: false,
  answer: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentId: (state, action) => {
      state.studentId = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setAnswer: (state, action) => {
      state.answer = action.payload;
    },
    resetStudent: (state) => {
      state.hasAnswered = false;
      state.answer = null;
    },
  },
});

export const {
  setStudentId,
  setName,
  setHasAnswered,
  setConnected,
  setAnswer,
  resetStudent,
} = studentSlice.actions;

export default studentSlice.reducer;
