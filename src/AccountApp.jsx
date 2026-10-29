import { useEffect } from 'react'
import { AuthProvider } from './auth/AuthProvider'
import RequireAuth from './auth/RequireAuth'
import { usePathname } from './lib/router'
import { supabaseConfigured } from './lib/supabase'
import { NotConfigured } from './auth/ui'
import { ACCOUNT_ROUTES } from './accountRoutes'
import { planFromSearch, rememberPlan } from './lib/planSelection'
// The account pages are small (~20 KB total), so they ship with this bundle
// instead of being fetched one by one — signup → login → account switch instantly.
import Login from './auth/pages/Login'
import Signup from './auth/pages/Signup'
import ForgotPassword from './auth/pages/ForgotPassword'
import ResetPassword from './auth/pages/ResetPassword'
import AuthCallback from './auth/pages/AuthCallback'
import Account from './auth/pages/Account'

const pages = {
  '/login': Login,
  '/signup': Signup,
  '/forgot-password': ForgotPassword,
  '/reset-password': ResetPassword,
  '/auth/callback': AuthCallback,
  '/account': Account,
}
const PROTECTED = new Set(['/account'])

export default function AccountApp() {
  const path = usePathname().replace(/\/+$/, '') || '/'
  const known = ACCOUNT_ROUTES.includes(path)

  // Keep the plan picked on the homepage (?plan=…) for the rest of the flow.
  useEffect(() => {
    rememberPlan(planFromSearch(window.location.search))
  }, [path])

  useEffect(() => {
    // Anything outside the account area belongs to the landing page: full load.
    if (!known) window.location.assign(path)
  }, [known, path])

  if (!known) return null
  if (!supabaseConfigured) return <NotConfigured />

  const Page = pages[path]
  const content = <Page />
  return <AuthProvider>{PROTECTED.has(path) ? <RequireAuth>{content}</RequireAuth> : content}</AuthProvider>
}
