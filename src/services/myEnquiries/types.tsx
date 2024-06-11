import { TermStatus, NegotiationTerm } from 'services/negotiation/types'
import { ChatMessage } from 'services/chat/types'
import { EnquiryType } from 'services/enquiry/types'

export type EventType =
  | 'NEW_APPOINTMENT'
  | 'MODIFIED_APPOINTMENT'
  | 'ACCEPT_APPOINTMENT'
  | 'CANCEL_APPOINTMENT'
  | 'DOCUMENT_UPLOAD'
  | 'DOCUMENT_DELETE'
  | 'COUNTER_NEGOTIATION'
  | 'ACCEPT_NEGOTIATION'
  | 'REJECT_NEGOTIATION'
  | 'SPECIAL_PROVISION_NEGOTIATION'
  | 'ACCEPT_SPECIAL_PROVISION'
  | 'REJECT_SPECIAL_PROVISION'
  | 'LEASE_SIGNED'
  | 'ACCEPT_LEASE'

/**
 *  Response from /myenquiries
 */
export interface MyEnquiriesAPIResponse {
  enquireId: number
  negotiationId: number
  enquireStatus: TermStatus
  spaceId: string
  terms: Array<NegotiationTerm>
  messages: Array<ChatMessage>
  lastReadByTenant?: string
  lastReadByLandlord?: string
  flex?: boolean
  flexType?: EnquiryType
  flexIdentifier?: number
  /* Tenant */
  peer1Id: string
  /* Landlord */
  peer2Id: string
  otherPeerDetails: {
    displayName?: string
  }
  lastActivityDetails?: {
    eventType: EventType
    eventDate: string
  }
  eventNotification?: boolean
}

export interface MyEnquiriesState {
  data?: Array<MyEnquiriesAPIResponse>
  loading: boolean
  error?: string
  notifications?: number
}
