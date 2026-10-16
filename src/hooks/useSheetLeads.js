/**
 * useSheetLeads — also saves each membership application to the
 * "Website Leads" tab of the Torque Network Leads Google Sheet
 * (via a Google Apps Script Web App).
 * URL: VITE_SHEET_WEBAPP_URL (env variable, set in Vercel)
 * Runs alongside Web3Forms; if it fails, the form still works as before.
 */
const SHEET_WEBAPP_URL = import.meta.env.VITE_SHEET_WEBAPP_URL

export function saveLeadToSheet(form) {
  if (!SHEET_WEBAPP_URL) return
  try {
    fetch(SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name: form.name,
        instagram: form.instagram,
        followers: form.followers,
        email: form.email,
        phone: form.phone,
        tier: form.tier,
        goals: form.goals,
      }),
    }).catch(() => {})
  } catch (e) { /* never block the form */ }
}
