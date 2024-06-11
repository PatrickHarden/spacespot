import axios from 'axios'
import { getEnquiryEvents } from '../api'

jest.mock('axios')

describe('negotiation API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('get enquiry events', async () => {
    const mockedEvents = [{}, {}]
    const mockedResponse = { events: mockedEvents }
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const enquiryId = '1'
    const token = 'Fake token'
    const enquiryResponse = await getEnquiryEvents(token, enquiryId)
    expect(enquiryResponse).toEqual(mockedEvents)
  })
})
