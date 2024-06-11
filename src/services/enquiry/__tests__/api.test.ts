import axios from 'axios'
import { EnquiryResponse, EnquiryRequest } from '../types'
import { FileItem } from 'services/global/types'
import {
  initEnquiry,
  getEnquiry,
  getDocuments,
  getDocument,
  deleteDocument,
  putDocument,
} from '../api'

jest.mock('axios')

describe('Enquiry API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Post init enquiry ', async () => {
    const mockedResponse = {} as EnquiryResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const spaceId = 'GB-Plus-473580'
    const token = 'Fake token'
    const request: EnquiryRequest = {
      spaceId,
      message: 'NA',
      negotiation: {
        flexible: true,
        terms: [],
      },
    }
    const enquiryResponse = await initEnquiry(token, request)
    expect(enquiryResponse).toEqual(mockedResponse)
  })

  it('get enquiry ', async () => {
    const mockedResponse = {} as EnquiryResponse
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const enquiryId = '1'
    const token = 'Fake token'
    const enquiryResponse = await getEnquiry(enquiryId, token)
    expect(enquiryResponse).toEqual(mockedResponse)
  })

  it('getDocuments ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const enquiryId = 1
    const token = 'Fake token'
    const docs = await getDocuments(enquiryId, token)
    expect(docs).toEqual(mockedResponse)
  })

  it('getDocument ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const doc = await getDocument(1, 1, 'token')
    expect(doc).toEqual(mockedResponse)
  })

  function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((fulfill, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => fulfill(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }

  it('putDocument ', async () => {
    const mockedResponse = { data: '' }
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const data = await blobToDataURL(new Blob(['data']))
    const item: FileItem = {
      key: 1,
      name: 'name1',
      type: 'pdf',
      uri: data,
    }
    const doc = await putDocument(item, 1, 'token')
    expect(doc).toEqual(mockedResponse)
  })

  it('deleteDocument ', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.delete.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const doc = await deleteDocument(1, 1, 'token')
    expect(doc).toEqual(mockedResponse)
  })
})
