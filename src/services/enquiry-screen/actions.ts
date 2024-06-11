import constants from './constants'
import { EnquiryScreenAction, EnquiryScreenStateData } from './types'

const get = (payload: EnquiryScreenStateData): EnquiryScreenAction => ({
  type: constants.GET,
  payload,
})

const getError = (payload: string): EnquiryScreenAction => ({
  type: constants.GET_ERROR,
  payload,
})
export default {
  get,
  getError,
}
