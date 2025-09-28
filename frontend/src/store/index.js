import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './slices/pollSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    student: studentReducer,
    teacher: teacherReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
