import types from './constants'
import {
  GetEnquiryEventsAction,
  GetEnquiryEventsErrorAction,
  GetEnquiryEventsSuccessAction,
  EnquiryEvent,
} from './types'

const get = (enquiryId: string): GetEnquiryEventsAction => ({
  type: types.GET,
  payload: {
    enquiryId,
  },
})

const getSuccess = (
  enquiryId: string,
  events: Array<EnquiryEvent>,
): GetEnquiryEventsSuccessAction => ({
  type: types.GET_SUCCESS,
  payload: {
    enquiryId,
    events,
  },
})

const getError = (
  enquiryId: string,
  error: string,
): GetEnquiryEventsErrorAction => ({
  type: types.GET_ERROR,
  payload: {
    enquiryId,
    error,
  },
})

export default { get, getSuccess, getError }
