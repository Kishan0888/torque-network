import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/**
 * Which product the home page is showing: 'instagram' (default) or 'linkedin'.
 * Set by the hero switch / floating switch; readable from a link such as
 * torquenetwork.in/?platform=linkedin (handy for LinkedIn ads).
 */
const PlatformContext = createContext({ platform: 'instagram', setPlatform: () => {} })
const KEY = 'torque_home_platform'
const valid = (p) => (p === 'linkedin' || p === 'instagram' ? p : null)

function initial() {
  if (typeof window === 'undefined') return 'instagram'
  const q = new URLSearchParams(window.location.search)
  const fromUrl = valid(q.get('platform')) || (window.location.hash === '#linkedin' ? 'linkedin' : null)
  if (fromUrl) return fromUrl
  try { return valid(sessionStorage.getItem(KEY)) || 'instagram' } catch { return 'instagram' }
}

export function PlatformProvider({ children }) {
  const [platform, set] = useState(initial)

  useEffect(() => {
    try { sessionStorage.setItem(KEY, platform) } catch { /* private mode */ }
    // Keep the address shareable without reloading or adding history entries.
    const url = new URL(window.location.href)
    if (platform === 'linkedin') url.searchParams.set('platform', 'linkedin')
    else url.searchParams.delete('platform')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }, [platform])

  const setPlatform = useCallback((p) => { if (valid(p)) set(p) }, [])
  return <PlatformContext.Provider value={{ platform, setPlatform }}>{children}</PlatformContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePlatform = () => useContext(PlatformContext)
