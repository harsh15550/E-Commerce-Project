import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice';
import productsReducer from './productSlice'; // <-- import your products slice
import cartReducer from './cartSlice'; // <-- import your products slice
import socketReducer from './socketSlice';
import chatReducer from './chatSlice';

// persist only the 'user' slice (authReducer)
const persistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'products', 'cartItems'] // this will persist only the user part
};

// combine all reducers
const rootReducer = combineReducers({
  user: authReducer,       // persisted
  products: productsReducer, 
  cartItems: cartReducer,
  socket: socketReducer,
  chat: chatReducer
});

// apply persist only to user (auth)
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in socket state
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'socket/setSocket'
        ],
        ignoredPaths: ['socket.socket'],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
