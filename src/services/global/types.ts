import { ChatState } from 'services/chat/types'
import { EnquiryState } from 'services/enquiry/types'
import { EnquiryScreenState } from 'services/enquiry-screen/types'
import { SpaceState } from 'services/space/types'
import { UserState } from 'services/user/types'
import { AppointmentState } from 'services/appointment/types'
import { OnBoardingState } from 'services/onboarding/types'
import { NegotiationState } from 'services/negotiation/types'
import { DashboardState } from 'services/dashboard/types'
import { MyEnquiriesState } from 'services/myEnquiries/types'
import { SearchState } from 'services/search/types'

export interface SpacespotState {
  chat?: ChatState
  dashboard?: DashboardState
  enquiry?: EnquiryState
  enquiryscreen?: EnquiryScreenState
  space?: SpaceState
  user?: UserState
  appointment?: AppointmentState
  onboarding?: OnBoardingState
  negotiation?: NegotiationState
  myenquiries?: MyEnquiriesState
  search?: SearchState
}

export interface SpacespotErrorApi {
  error?: any
  message?: any
}

export interface FileItem {
  key: number
  uri: string
  name: string
  type: string
}
