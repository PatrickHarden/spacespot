export interface EnquiryEvent {
  eventId: number
  eventMessage: any
  eventType: string
  eventDate: Date
}

export interface EnquiryEventState {
  [enquiryId: string]: {
    events: Array<EnquiryEvent>
    isLoading?: boolean
    error?: string
  }
}

export interface GetEnquiryEventsAction {
  type: string
  payload: {
    enquiryId: string
  }
}

export interface GetEnquiryEventsSuccessAction {
  type: string
  payload: {
    enquiryId: string
    events: Array<EnquiryEvent>
  }
}

export interface GetEnquiryEventsErrorAction {
  type: string
  payload: {
    enquiryId: string
    error: string
  }
}

export type EnquiryEventAction =
  | GetEnquiryEventsAction
  | GetEnquiryEventsSuccessAction
  | GetEnquiryEventsErrorAction
