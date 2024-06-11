import axios from 'axios'
import {
  getBuildingId,
  getSpaceId,
  createBuilding,
  putDocument,
  createSpace,
  updateBuilding,
  updateSpace,
  deleteSpace,
  deleteBuilding,
} from '../api'
import { BuildingDTO, SpaceDTO } from '../types'

jest.mock('axios')

describe('Enquiry API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('get getBuildingId ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const buildingId = await getBuildingId(token)
    expect(buildingId).toEqual(mockedResponse)
  })

  it('get getSpaceId ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const spaceId = await getSpaceId(token)
    expect(spaceId).toEqual(mockedResponse)
  })

  it('post Building ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const params = {} as BuildingDTO
    const building = await createBuilding(params, token)
    expect(building).toEqual(mockedResponse)
  })

  it('put Building ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const params = {} as BuildingDTO
    const building = await updateBuilding(params, token)
    expect(building).toEqual(mockedResponse)
  })

  it('putDocument ', async () => {
    const mockFinalResponse = ''
    const mockedResponse = { url: mockFinalResponse }
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const image = {
      key: 0,
      name: 'Item 3.png',
      type: 'image/png',
      uri:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    }
    const spaceId = '2'
    const imageResponse = await putDocument(image, spaceId, token, 'pictures')
    expect(imageResponse).toEqual(mockFinalResponse)
  })

  it('post Space ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const params = {} as SpaceDTO
    const space = await createSpace(params, token)
    expect(space).toEqual(mockedResponse)
  })

  it('put Space ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const params = {} as SpaceDTO
    const space = await updateSpace('0', params, token)
    expect(space).toEqual(mockedResponse)
  })

  it('delete Space ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.delete.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const space = await deleteSpace('SS_SPACE_0', token)
    expect(space).toEqual(mockedResponse)
  })

  it('delete Building ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.delete.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const token = 'Fake token'
    const space = await deleteBuilding('SS_BUILDING_0', token)
    expect(space).toEqual(mockedResponse)
  })
})
