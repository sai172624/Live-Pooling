import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  students: [],
  answeredCount: 0,
  totalStudents: 0,
  canCreatePoll: true,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
      state.totalStudents = action.payload.length;
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
      state.totalStudents = state.students.length;
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload);
      state.totalStudents = state.students.length;
    },
    updateAnsweredCount: (state, action) => {
      state.answeredCount = action.payload.answeredCount;
      state.totalStudents = action.payload.totalStudents;
    },
    setCanCreatePoll: (state, action) => {
      state.canCreatePoll = action.payload;
    },
  },
});

export const {
  setConnected,
  setStudents,
  addStudent,
  removeStudent,
  updateAnsweredCount,
  setCanCreatePoll,
} = teacherSlice.actions;

export default teacherSlice.reducer;
