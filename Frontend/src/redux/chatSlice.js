import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload; // Sets all messages
    },
    addMessage: (state, action) => {
      state.message.push(action.payload); // Adds one message
    },
  },
});

export const { setMessage, addMessage } = chatSlice.actions;

export default chatSlice.reducer;
