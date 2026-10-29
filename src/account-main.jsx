import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AccountApp from './AccountApp.jsx'

// Entry for /signup, /login, /account, etc. (served from account.html via
// vercel.json rewrites). If the file itself is requested directly, show /account.
if (window.location.pathname === '/account.html') {
  window.history.replaceState({}, '', '/account' + window.location.search + window.location.hash)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccountApp />
  </StrictMode>,
)
