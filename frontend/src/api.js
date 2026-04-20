const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function getAuthToken() {
  return localStorage.getItem('mk_token')
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('mk_token', token)
  } else {
    localStorage.removeItem('mk_token')
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, { ...options, headers })
  let data = null
  try {
    data = await res.json()
  } catch {
    // ignore JSON parse errors; data stays null
  }
  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || `Server error: ${res.status}`
    throw new Error(message)
  }
  return data
}

export const api = {
  register(email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data?.access_token) {
      setAuthToken(data.access_token)
    }
    return data
  },
  logout() {
    setAuthToken(null)
  },
  generatePlan(goal) {
    return request('/generate-plan', {
      method: 'POST',
      body: JSON.stringify({ goal }),
    })
  },
  listPlans() {
    return request('/plans', { method: 'GET' })
  },
  getPlan(id) {
    return request(`/plans/${id}`, { method: 'GET' })
  },
  updateStep(stepId, completed) {
    return request(`/steps/${stepId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    })
  },
}

