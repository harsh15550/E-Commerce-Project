import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // user info (null by default)
  admin: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setAdmin(state, action) {
      state.admin = action.payload;
    }
  },
});

export const { setUser, setAdmin } = userSlice.actions;
export default userSlice.reducer;
