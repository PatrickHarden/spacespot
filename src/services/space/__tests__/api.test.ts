import axios from 'axios'
import { SpaceSearchResponse, SpaceGetResponse, SearchOptions } from '../types'
import { getSpace, searchSpaces } from '../api'

jest.mock('axios')

describe('Spaces API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('search spaces ', async () => {
    const mockedResponse = {} as SpaceSearchResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    const options: SearchOptions = {
      locale: 'en-UK',
      region: 'Oslo',
    }
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const searchResponse = await searchSpaces(options)
    expect(searchResponse).toEqual(mockedResponse)
  })

  it('search buildings ', async () => {
    const mockedResponse = {} as SpaceSearchResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    const options: SearchOptions = {
      locale: 'en-UK',
      region: 'Oslo',
      isParent: true,
    }
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const searchResponse = await searchSpaces(options)
    expect(searchResponse).toEqual(mockedResponse)
  })

  it('search landlord spaces ', async () => {
    const mockedResponse = {} as SpaceSearchResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    const options: SearchOptions = {
      locale: 'en-UK',
      region: 'Oslo',
      landLord: '0101-0101',
    }
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const searchResponse = await searchSpaces(options)
    expect(searchResponse).toEqual(mockedResponse)
  })

  it('search building spaces ', async () => {
    const mockedResponse = {} as SpaceSearchResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    const options: SearchOptions = {
      locale: 'en-UK',
      region: 'Oslo',
      parentProperty: 'SS_SPACE_111',
    }
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const searchResponse = await searchSpaces(options)
    expect(searchResponse).toEqual(mockedResponse)
  })

  it('get space ', async () => {
    const mockedResponse = {} as SpaceGetResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const getResponse = await getSpace('id1')
    expect(getResponse).toBeTruthy()
  })
})
