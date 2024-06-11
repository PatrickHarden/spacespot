/**
 * Toaster Message types
 */
export type ToasterMessageType = 'error' | 'success' | 'info'

/**
 * Toaster message
 */
export interface ToasterMessage {
  /** Message type */
  type: ToasterMessageType
  /** Message text */
  message: string
  /** Max date */
  maxTime: number
}

/**
 * Toaster redux state
 */
export interface ToasterState {
  /** Messages */
  messages: Array<ToasterMessage>
}

/**
 * Toaster Message Action
 */
export interface MessageAction {
  type: string
  payload: ToasterMessage
}
