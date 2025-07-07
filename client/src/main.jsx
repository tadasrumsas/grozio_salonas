import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { UserContextProvider } from './contexts/UserContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </UserContextProvider>
  </BrowserRouter>
)
