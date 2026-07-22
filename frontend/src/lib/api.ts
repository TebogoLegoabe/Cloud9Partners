import { supabase } from './supabase'
import type {
  PaymentInitiation,
  Profile,
  ServiceRequest,
  ServiceType,
  Vehicle,
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

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
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
