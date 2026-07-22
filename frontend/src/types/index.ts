export type Role = 'buyer' | 'sales_rep' | 'admin'

export type ServiceType = 'consulting' | 'quote_comparison'

export interface Profile {
  id: string
  role: Role
  first_name: string
  last_name: string
  email: string
  phone: string
  created_at: string
  sales_rep_profile?: SalesRepProfile
}

export interface SalesRepProfile {
  id: string
  profile_id: string
  dealership_name: string
  location: string
  status: 'pending' | 'approved' | 'rejected'
  review_comments: string | null
  rep_code: string | null
  created_at: string
  reviewed_at: string | null
}

export interface Vehicle {
  make?: string | null
  model?: string | null
  year?: string | null
  colour?: string | null
  variant?: string | null
}

export interface ServiceRequest {
  id: string
  buyer_id: string
  service_type: ServiceType
  status: 'pending_payment' | 'active' | 'quoting' | 'completed' | 'cancelled'
  vehicle: Vehicle
  vehicle_type: string | null
  preferred_brands: string[]
  budget: number
  condition: string | null
  payment_method: string | null
  province: string | null
  timeline: string | null
  contact_method: string | null
  notes: string | null
  advisory_fee_cents: number
  created_at: string
  quotes?: Quote[]
}

export interface Quote {
  id: string
  request_id: string
  sales_rep_id: string
  dealership_name: string | null
  price_cents: number
  interest_rate: number | null
  term_months: number | null
  details: string | null
  status: 'submitted' | 'accepted' | 'declined'
  created_at: string
}

export interface PaymentInitiation {
  payment_id: string
  process_url: string
  fields: Record<string, string>
}
