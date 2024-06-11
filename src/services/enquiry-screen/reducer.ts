import constants from './constants'
import {
  EnquiryScreenState,
  EnquiryScreenAction,
  EnquiryScreenStateData,
} from './types'

const initialState: EnquiryScreenState = {}

const reducer = (
  state: EnquiryScreenState = initialState,
  action: EnquiryScreenAction,
): EnquiryScreenState => {
  switch (action.type) {
    case constants.GET:
      return { ...initialState, data: action.payload as EnquiryScreenStateData }
    case constants.GET_ERROR:
      return { ...initialState, error: action.payload as string }
    default:
      return state
  }
}
export default reducer
