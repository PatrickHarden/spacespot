import { get } from 'lodash'
import constants from './constants'
import { ChatAction, ChatState, ChatResponse, ChatMessage } from './types'

const initialState: ChatState = {}
const addNewMessage = (
  data: ChatResponse,
  payload: ChatMessage,
): ChatResponse => {
  const messagesOld: Array<ChatMessage> = get(data, 'messages')
  return { ...data, messages: [...messagesOld, payload] }
}
const reducer = (
  state: ChatState = initialState,
  action: ChatAction,
): ChatState => {
  switch (action.type) {
    case constants.GET:
      return { ...state }
    case constants.GET_ERROR:
      return { ...state, error: action.payload as string }
    case constants.GET_SUCCESS:
      return { ...state, data: action.payload as ChatResponse }
    case constants.NEW_MESSAGE_SUCCESS:
      return {
        ...state,
        data: addNewMessage(
          state.data as ChatResponse,
          action.payload as ChatMessage,
        ),
      }
    default:
      return state
  }
}
export default reducer
