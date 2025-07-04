import { createRoot } from 'react-dom/client'
import store, { persistor } from '../../Frontend/src/redux/store.js';
import App from './App.jsx'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <App />
      </PersistGate>
    </Provider>
  </>,
)
