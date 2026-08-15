import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GastosProvider } from './context/GastosContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GastosProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GastosProvider>
  </StrictMode>,
)