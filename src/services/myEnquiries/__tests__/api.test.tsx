import axios from 'axios'
import {
  getMyEnquiriesAPI,
  acceptMyEnquiriesAPI,
  rejectMyEnquiriesAPI,
  cancelMyEnquiriesAPI,
} from '../api'
import { MyEnquiriesAPIResponse } from '../types'

jest.mock('axios')

describe('MyEnquiries API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('get myEnquiries', async () => {
    const mockedResponse = {} as MyEnquiriesAPIResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const negotiationResponse = await getMyEnquiriesAPI(token)
    expect(negotiationResponse).toEqual(mockedResponse)
  })

  it('accept myEnquiries', async () => {
    const mockedResponse = {} as MyEnquiriesAPIResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const idEnquiry = '1'
    const negotiationResponse = await acceptMyEnquiriesAPI(token, idEnquiry)
    expect(negotiationResponse).toEqual(mockedResponse)
  })

  it('reject myEnquiries', async () => {
    const mockedResponse = {} as MyEnquiriesAPIResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const idEnquiry = '1'
    const negotiationResponse = await rejectMyEnquiriesAPI(token, idEnquiry)
    expect(negotiationResponse).toEqual(mockedResponse)
  })

  it('cancel myEnquiries', async () => {
    const mockedResponse = {} as MyEnquiriesAPIResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const idEnquiry = '1'
    const negotiationResponse = await cancelMyEnquiriesAPI(token, idEnquiry)
    expect(negotiationResponse).toEqual(mockedResponse)
  })
})
