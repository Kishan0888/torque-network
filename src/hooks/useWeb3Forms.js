/**
 * useWeb3Forms — submits creator application via Web3Forms
 * Endpoint: https://api.web3forms.com/submit
 * Key: VITE_WEB3FORMS_ACCESS_KEY (env variable)
 */
export async function submitCreatorApplication(form) {
  const goals = Array.isArray(form.goals) ? form.goals.join(', ') : form.goals || 'None'
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  const body = {
    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
    subject: 'New Creator Application – Torque Network',
    from_name: 'Torque Network',
    to: 'sunil.mc4k@gmail.com',

    // Well-formatted message body
    message: `
NEW CREATOR APPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERSONAL INFO
Name:             ${form.name}
Email:            ${form.email}
Phone:            ${form.phone}
WhatsApp:         ${form.whatsapp || '—'}

CREATOR PROFILE
Instagram Handle: ${form.instagram}
Profile URL:      ${form.profile_url || '—'}
Followers:        ${form.followers}
Primary Niche:    ${form.niche}
Secondary Niche:  ${form.niche2 || 'None'}

LOCATION & PLATFORMS
City:             ${form.city}
State:            ${form.state}
Content Language: ${form.language}
Platforms Used:   ${form.platforms}
Posting Frequency:${form.frequency}

GOALS
${goals}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted At: ${submittedAt} IST
    `.trim(),

    // Individual fields for Web3Forms table view
    'Full Name':         form.name,
    'Email':             form.email,
    'Phone':             form.phone,
    'WhatsApp':          form.whatsapp || '—',
    'Instagram Handle':  form.instagram,
    'Profile URL':       form.profile_url || '—',
    'Followers':         form.followers,
    'Primary Niche':     form.niche,
    'Secondary Niche':   form.niche2 || 'None',
    'City':              form.city,
    'State':             form.state,
    'Content Language':  form.language,
    'Platforms Used':    form.platforms,
    'Posting Frequency': form.frequency,
    'Goals':             goals,
    'Submitted At':      submittedAt,

    // Disable Web3Forms bot check redirect
    botcheck: '',
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Submission failed')
  }

  return data
}
