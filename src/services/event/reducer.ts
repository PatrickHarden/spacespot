import { get } from 'lodash'
import constants from './constants'
import {
  EnquiryEventState,
  EnquiryEventAction,
  GetEnquiryEventsErrorAction,
  GetEnquiryEventsSuccessAction,
} from './types'

const initialState: EnquiryEventState = {}

const reducer = (
  state = initialState,
  action: EnquiryEventAction,
): EnquiryEventState => {
  const id = get(action, 'payload.enquiryId', 0)
  switch (action.type) {
    case constants.GET:
      return {
        ...state,
        [id]: {
          events: state[id] ? state[id].events : [],
          isLoading: true,
        },
      }
    case constants.GET_ERROR:
      return {
        ...state,
        [id]: {
          events: [],
          isLoading: false,
          error: (action as GetEnquiryEventsErrorAction).payload.error,
        },
      }
    case constants.GET_SUCCESS:
      return {
        ...state,
        [id]: {
          events: (action as GetEnquiryEventsSuccessAction).payload.events,
          isLoading: false,
        },
      }
    default:
      return state
  }
}

export default reducer
