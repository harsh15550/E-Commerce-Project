import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [], // cartItems info (null by default)
};

const cartSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.cartItems = action.payload;
    }
  },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
