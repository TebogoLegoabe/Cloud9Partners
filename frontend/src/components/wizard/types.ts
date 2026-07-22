import type { ServiceType } from '../../types'

export interface AccountData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface DetailsData {
  hasSpecificVehicle: boolean | null
  make: string
  model: string
  year: string
  colour: string
  variant: string
  vehicleType: string
  brands: string[]
  budget: number
  condition: string
  paymentMethod: string
  province: string
  timeline: string
  contactMethod: string
  notes: string
}

export interface WizardData {
  account: AccountData
  serviceType: ServiceType | null
  details: DetailsData
}

export const initialWizardData: WizardData = {
  account: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  },
  serviceType: null,
  details: {
    hasSpecificVehicle: null,
    make: '',
    model: '',
    year: '',
    colour: '',
    variant: '',
    vehicleType: '',
    brands: [],
    budget: 200000,
    condition: '',
    paymentMethod: '',
    province: '',
    timeline: '',
    contactMethod: '',
    notes: '',
  },
}

export const ADVISORY_FEES: Record<ServiceType, number> = {
  consulting: 500,
  quote_comparison: 750,
}

export const formatRands = (amount: number): string =>
  `R${amount.toLocaleString('en-ZA').replace(/,/g, ' ')}`
