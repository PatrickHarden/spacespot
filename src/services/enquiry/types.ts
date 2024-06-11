import { FileItem } from 'services/global/types'
import { NegotiationTerm } from 'services/negotiation/types'

export interface DocumentDTO {
  fileId: number
  fileName: string
  enquireId: number
  uploadAt: Date
  uploadedBy: string
  documentType?: string
}

export const DOC_TYPE_TEMPLATE = 'CompanyTemplate'

export type DocData = any

export interface EnquiryAction {
  type: string
  payload:
    | string
    | number
    | DocumentDTO
    | Array<DocumentDTO>
    | EnquiryResponse
    | FileItem
    | DocData
    | EnquiryRequest
}

export interface EnquiryState {
  data?: EnquiryResponse
  docs?: Array<DocumentDTO>
  error?: string
}

export enum EnquiryType {
  HotDesk = 'HotDesk',
  FixedDesk = 'FixedDesk',
  ServicedOffice = 'ServicedOffice',
  notChecked = '',
}

export interface EnquiryResponse {
  chatId: number
  enquireId: number
  spaceId: string
  /* Tenant */
  peer1Id: string
  /* Landlord */
  peer2Id: string
  negotiationId?: number
  enquireStatus?: string
  flexType?: EnquiryType
  flex: boolean
}

export interface EnquiryAPIResultActions {
  successSignInAfter?: boolean
  errorShowMessage?: string
}

export interface EnquiryRequest {
  spaceId: string
  message: string
  negotiation: {
    flexible: boolean
    terms: Array<NegotiationTerm>
  }
  userId?: string
  loggedIn?: boolean
  apiResultActions?: EnquiryAPIResultActions
}

export interface EnquiryRequestFlex {
  spaceId: string
  message: string
  flex: boolean
  flexType: EnquiryType
  flexIdentifier?: string
  negotiation: {
    terms: Array<NegotiationTerm>
  }
  userId?: string
  loggedIn?: boolean
  apiResultActions?: EnquiryAPIResultActions
}
