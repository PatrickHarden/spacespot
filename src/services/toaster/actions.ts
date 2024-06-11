import constans from './constants'
import { ToasterMessageType, MessageAction } from './types'

const addMessage = (
  type: ToasterMessageType,
  message: string,
  messageDisplayDelay?: number,
): MessageAction => ({
  type: constans.ADD_MSG,
  payload: {
    type,
    message,
    maxTime: Date.now() + (messageDisplayDelay ? messageDisplayDelay : 5000),
  },
})

const showInfo = (message: string): MessageAction => addMessage('info', message)

const showSuccess = (
  message: string,
  messageDisplayDelay?: number,
): MessageAction => addMessage('success', message, messageDisplayDelay)

const showError = (
  message: string,
  messageDisplayDelay?: number,
): MessageAction => addMessage('error', message, messageDisplayDelay)

export default {
  addMessage,
  showInfo,
  showSuccess,
  showError,
}
