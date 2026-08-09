import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BrandShell from './BrandShell.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrandShell>
      <App />
    </BrandShell>
  </StrictMode>,
)
