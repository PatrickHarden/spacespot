export interface ChatAction {
  type: string
  payload?: ChatResponse | ChatMessage | string
}
export interface MessageAction {
  type: string
  payload?: string
}
export interface ChatState {
  data?: ChatResponse
  error?: string
}

export interface ChatResponse {
  chatId: number
  enquiryId: number
  peer1Id: string
  peer2Id: string
  messages: Array<ChatMessage>
}

export interface ChatMessage {
  userId: string
  message: string
  sentAt: string
}
