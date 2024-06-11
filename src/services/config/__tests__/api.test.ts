import axios from 'axios'
import { getAmenities, AmenityData } from '../api'

jest.mock('axios')

const mockedResponse = {} as Array<AmenityData>
const getMock = () => {
  return Promise.resolve({
    data: mockedResponse,
  })
}

describe('Config API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Get amenities', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(getMock)
    const response = await getAmenities('', 'en-EN')
    expect(response).toEqual(mockedResponse)
  })
})
