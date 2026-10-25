import { useEffect, useState } from 'react'

/** Minimal pathname router for the account pages (the landing page stays a single page). */
// eslint-disable-next-line react/only-export-components
export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname + window.location.search) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// eslint-disable-next-line react/only-export-components
export function usePathname() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])
  return path
}

/** Declarative redirect (navigates after render, never during it). */
export function Redirect({ to }) {
  useEffect(() => {
    navigate(to, { replace: true })
  }, [to])
  return null
}

export function Link({ to, children, ...rest }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
