import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ACCOUNT_ROUTES } from './accountRoutes'

// Account pages are loaded on demand so the landing page bundle is unchanged.
const AccountApp = lazy(() => import('./AccountApp.jsx'))
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isAccountRoute = ACCOUNT_ROUTES.includes(path)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAccountRoute ? (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050816' }} />}>
        <AccountApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
