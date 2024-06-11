import axios, { AxiosResponse } from 'axios'
import CONFIG from 'config'
import { ChatResponse, ChatMessage } from './types'

export const getChat = async (
  enquireId: string,
  token: string,
): Promise<ChatResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquireId}/chat/`
  const config = { headers: { Authorization: `Bearer ${token}` } }

  const resp: AxiosResponse<ChatResponse> = await axios.get(url, config)
  return resp.data
}

type DataToSendMessage = {
  userId: string
  message: string
}

export const newMessageChat = async (
  enquireId: string,
  token: string,
  data: DataToSendMessage,
): Promise<ChatMessage> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquireId}/chat/`
  const config = { headers: { Authorization: `Bearer ${token}` } }

  const resp: AxiosResponse<ChatMessage> = await axios.post(url, data, config)
  return resp.data
}
