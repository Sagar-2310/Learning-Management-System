import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'; 
import store from './redux/store';
import { Toaster } from 'sonner'; 

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Corrected the closing tag here */}
      <PersistGate loading={null} persistor={persistor}>
         <App />
      </PersistGate> 
    </Provider>
    <Toaster />
  </React.StrictMode>
);