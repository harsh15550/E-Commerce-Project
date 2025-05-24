// productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectProduct : {},
    allProduct: []
}
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectProduct: (state, action) => {
      state.selectProduct = action.payload;
    },
    setAllProducts: (state, action) => {
        state.allProduct = action.payload;

    }
  },
});

export const { setSelectProduct, setAllProducts } = productsSlice.actions;

export default productsSlice.reducer;