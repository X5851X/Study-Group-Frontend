import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import groupsReducer from './groupSlice';

// Ambil user dari localStorage
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

// Set preloadedState untuk Redux
const preloadedState = {
  user: {
    user: userFromStorage,
    token: userFromStorage?.token || null,
  }
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupsReducer,
  },
  preloadedState,
});
