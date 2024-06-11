import constants from './constants'
import { MyEnquiriesState, MyEnquiriesAPIResponse } from './types'
import { TermStatus } from 'services/negotiation/types'

const initialState: MyEnquiriesState = { data: undefined, loading: false }

const getUpdatedData = (
  payload: MyEnquiriesAPIResponse,
  data: Array<MyEnquiriesAPIResponse>,
  termStatus: TermStatus,
) =>
  data.map((enquiry: any) =>
    enquiry.enquireId === payload.enquireId
      ? { ...enquiry, enquireStatus: termStatus }
      : enquiry,
  )

const TranslatingActionToTerms = {
  [constants.ACCEPT_SUCCESS]: TermStatus.Accepted,
  [constants.REJECT_SUCCESS]: TermStatus.Declined,
  [constants.CANCEL_SUCCESS]: TermStatus.Closed,
}

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case constants.GET:
      return { ...state, loading: true }
    case constants.GET_ERROR:
      return { error: action.payload as string, loading: false }
    case constants.GET_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      }
    case constants.ACCEPT_SUCCESS:
    case constants.REJECT_SUCCESS:
    case constants.CANCEL_SUCCESS:
      return {
        ...state,
        data: getUpdatedData(
          action.payload,
          state.data as Array<MyEnquiriesAPIResponse>,
          TranslatingActionToTerms[action.type],
        ),
      }
    case constants.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      }
    default:
      return state
  }
}

export default reducer
