import { supabase } from './supabase'
import type {
  PaymentInitiation,
  Profile,
  ServiceRequest,
  ServiceType,
  Vehicle,
  CarComparison,
} from '../types'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (supabase) {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  let refreshSucceeded = false
  if (res.status === 401 && supabase) {
    const { data, error } = await supabase.auth.refreshSession()
    const refreshedToken = data.session?.access_token
    if (!error && refreshedToken) {
      refreshSucceeded = true
      headers.set('Authorization', `Bearer ${refreshedToken}`)
      res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
    }
  }
  if (res.status === 401 && supabase) {
    if (!refreshSucceeded) {
      await supabase.auth.signOut({ scope: 'local' })
      if (!window.location.pathname.startsWith('/signin')) {
        window.location.replace('/signin?expired=1')
      }
      throw new ApiError(401, 'Your session expired. Please sign in again.')
    }
    throw new ApiError(401, 'We could not verify your account with the service. Please try again.')
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(res.status, (body as { error?: string }).error ?? 'Request failed')
  }
  return body as T
}

export interface CreateRequestPayload {
  service_type: ServiceType
  vehicle?: Vehicle
  vehicle_type?: string
  preferred_brands?: string[]
  budget: number
  condition?: string
  payment_method?: string
  province?: string
  timeline?: string
  contact_method?: string
  notes?: string
}

export const api = {
  createProfile: (data: {
    first_name: string
    last_name: string
    phone: string
    role?: 'buyer' | 'sales_rep'
  }) => apiFetch<Profile>('/api/profiles', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => apiFetch<Profile>('/api/me'),

  createRequest: (data: CreateRequestPayload) =>
    apiFetch<ServiceRequest>('/api/requests', { method: 'POST', body: JSON.stringify(data) }),

  listRequests: () => apiFetch<ServiceRequest[]>('/api/requests'),

  getRequest: (id: string) => apiFetch<ServiceRequest>(`/api/requests/${id}`),

  initiatePayment: (requestId: string) =>
    apiFetch<PaymentInitiation>('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ request_id: requestId }),
    }),

  compareCars: (data: { car_a: string; car_b: string; priorities?: string }) =>
    apiFetch<CarComparison>('/api/ai/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

/** Render and auto-submit a hidden form that redirects to PayFast. */
export function redirectToPayfast(init: PaymentInitiation): void {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = init.process_url
  for (const [name, value] of Object.entries(init.fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}
