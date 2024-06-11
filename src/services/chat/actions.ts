import { ChatAction, ChatResponse, ChatMessage } from './types'
import constants from './constants'

const get = (): ChatAction => ({
  type: constants.GET,
})
const getSuccess = (payload: ChatResponse) => ({
  type: constants.GET_SUCCESS,
  payload,
})
const getError = (payload: string): ChatAction => ({
  type: constants.GET_ERROR,
  payload,
})

const newMessage = (payload: string) => ({
  type: constants.NEW_MESSAGE,
  payload,
})
const newMessageSuccess = (payload: ChatMessage) => ({
  type: constants.NEW_MESSAGE_SUCCESS,
  payload,
})
const newMessageError = (payload: string) => ({
  type: constants.NEW_MESSAGE_ERROR,
  payload,
})
export default {
  get,
  getSuccess,
  getError,
  newMessage,
  newMessageSuccess,
  newMessageError,
}
