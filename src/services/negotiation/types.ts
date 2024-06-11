export interface NegotiationTerm {
  termId: number
  value: string
}

export enum TermStatus {
  Pending = 'PENDING_TO_ACCEPT',
  Accepted = 'ACCEPTED',
  Created = 'CREATED',
  Proposed = 'PROPOSED',
  Declined = 'REJECTED',
  Closed = 'CLOSED',
}

export enum DepositType {
  Cash = 'CASH',
  Guarantee = 'GUARANTEE',
}

export enum PaymentType {
  Monthly = 'MONTHLY',
  Quaterly = 'QUARTERLY',
}

export interface NegotiationTerms {
  area?: number
  sizeUnits?: string
  start?: string
  duration?: number
  rent?: number
  serviceCharges?: number
  additionalCosts?: number
  currencyCode?: string
  deposit?: number
  depositType?: DepositType
  frequency?: PaymentType
  noOfDesks?: number
}

// field name capitalized
export interface NegotiationTermFields {
  [key: number]: string
}

// key decapitalized
export interface NegotiationTermFieldsIds {
  [key: string]: number
}

export enum SpecialProvisionStatus {
  Created = 'CREATED',
  Accepted = 'ACCEPTED',
  Proposed = 'PROPOSED',
  Declined = 'REJECTED',
  Closed = 'CLOSED',
  null = 'null',
}

export interface NegotiationAPIResponse {
  terms: Array<NegotiationTerm>
  specialProvision?: string
  specialProvisionStatus?: SpecialProvisionStatus
  status?: TermStatus
  fitoutOption?: number
  peer1SignLeaseStatus?: NegotiationStatus
  peer2SignLeaseStatus?: NegotiationStatus
}

export interface FitoutOptionProps {
  id?: string
  isCustom?: boolean
  name: string
  description: string
  amount: number
}

export interface SelectedFitoutOption {
  custom: boolean
  fitoutOption: any
}

export enum NegotiationStatus {
  TermsNotAgreed = 'TermsNotAgreed',
  TermsAgreed = 'TermsAgreed',
  PreviewStart = 'PreviewStart',
  SignInfo = 'SignInfo',
  AcceptLease = 'AcceptLease',
  LeaseAccepted = 'LeaseAccepted',
  LeaseSignInitiated = 'LeaseSignInitiated',
  LeaseSigned = 'LeaseSigned',
}

export interface NegotiationStatusResponse {
  negotiationId?: number
  peer1SignLeaseStatus: NegotiationStatus
  peer2SignLeaseStatus: NegotiationStatus
}

export interface SignerInfoDTO {
  id?: string
  name: string
  emailId: string
  companyName: string
  companyNumber: string
}

export interface SignerDetailDTO {
  recipientId: string
  name: string
  emailId: string
  signerStatus: 'sent' | 'completed'
  signerType: 'Tenant' | 'Landlord'
  signedDate?: Date
  deliveredDate?: Date
  companyName?: string
  companyNumber?: string
}

export interface NegotiationState {
  data?: NegotiationAPIResponse
  termsFields?: NegotiationTermFields
  customFitout?: Array<FitoutOptionProps>
  signerInfo?: SignerInfoDTO
  error?: string
  loading: boolean
}
