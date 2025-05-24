import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

createRoot(document.getElementById('root')).render(

  <>
    <Provider store={store} >
      <Elements stripe={stripePromise}>
        <PersistGate loading={null} persistor={persistor} >
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Elements>
    </Provider>
  </>,
)
