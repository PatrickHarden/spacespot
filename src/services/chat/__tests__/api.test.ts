import axios from 'axios'
import { ChatResponse } from '../types'
import { getChat, newMessageChat } from '../api'

jest.mock('axios')

const mockedResponse = {} as ChatResponse
const getMock = () => {
  return Promise.resolve({
    data: mockedResponse,
  })
}

describe('chat API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Chat get', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(getMock)
    const enquiryId = '1'
    const token = 'Fake token'
    const chatResponse = await getChat(enquiryId, token)
    expect(chatResponse).toEqual(mockedResponse)
  })

  it('send message', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(getMock)
    const enquiryId = '1'
    const token = 'Fake token'
    const data = {
      userId: '1',
      message: 'Test message',
    }
    const chatResponse = await newMessageChat(enquiryId, token, data)
    expect(chatResponse).toEqual(mockedResponse)
  })
})
