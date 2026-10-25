import { lazy, Suspense, useEffect } from 'react'
import { AuthProvider } from './auth/AuthProvider'
import RequireAuth from './auth/RequireAuth'
import { usePathname } from './lib/router'
import { supabaseConfigured } from './lib/supabase'
import { NotConfigured, Loading } from './auth/ui'
import { ACCOUNT_ROUTES } from './accountRoutes'

const pages = {
  '/login': lazy(() => import('./auth/pages/Login')),
  '/signup': lazy(() => import('./auth/pages/Signup')),
  '/forgot-password': lazy(() => import('./auth/pages/ForgotPassword')),
  '/reset-password': lazy(() => import('./auth/pages/ResetPassword')),
  '/auth/callback': lazy(() => import('./auth/pages/AuthCallback')),
  '/account': lazy(() => import('./auth/pages/Account')),
}
const PROTECTED = new Set(['/account'])

export default function AccountApp() {
  const path = usePathname().replace(/\/+$/, '') || '/'
  const known = ACCOUNT_ROUTES.includes(path)

  useEffect(() => {
    // Anything outside the account area belongs to the landing page: full load.
    if (!known) window.location.assign(path)
  }, [known, path])

  if (!known) return null
  if (!supabaseConfigured) return <NotConfigured />

  const Page = pages[path]
  const content = <Suspense fallback={<Loading />}><Page /></Suspense>
  return <AuthProvider>{PROTECTED.has(path) ? <RequireAuth>{content}</RequireAuth> : content}</AuthProvider>
}
