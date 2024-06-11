import axios from 'axios'
import {
  getNegotiationTerms,
  getNegotiationTermsFields,
  putCounterNegotiationTerms,
  acceptNegotiationTerms,
  rejectNegotiationTerms,
  getCustomFitout,
  putCustomFitout,
  saveSpecialProvision,
  acceptSpecialProvision,
  rejectSpecialProvision,
  selectFitoutAPI,
  deleteFitoutAPI,
  putSignLeaseStatusAPI,
  getNegotiationStatus,
  postSignerInfo,
  putSignerInfo,
  getSignerInfo,
  acceptLease,
  finalSign,
  getPreviewLeaseSagaAPI,
} from '../api'
import {
  NegotiationAPIResponse,
  FitoutOptionProps,
  SelectedFitoutOption,
  NegotiationStatus,
} from '../types'

jest.mock('axios')

describe('negotiation API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('get negotiation', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })
    const enquiryId = '1'
    const token = 'Fake token'
    const resp = await getNegotiationTerms(token, enquiryId)
    expect(resp).toEqual(mockedResponse)
  })

  it('get negotiation fields', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })

    const token = 'Fake token'
    const resp = await getNegotiationTermsFields(token)
    expect(resp).toEqual(mockedResponse)
  })

  it('put counter negotiation', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })

    const token = 'Fake token'
    const enquiryId = 1
    const data = {} as NegotiationAPIResponse
    const resp = await putCounterNegotiationTerms(token, enquiryId, data)
    expect(resp).toEqual(mockedResponse)
  })

  it('accept negotiation', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })

    const token = 'Fake token'
    const enquiryId = 1
    const resp = await acceptNegotiationTerms(token, enquiryId)
    expect(resp).toEqual(mockedResponse)
  })
  it('reject negotiation', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })

    const token = 'Fake token'
    const enquiryId = 1
    const resp = await rejectNegotiationTerms(token, enquiryId)
    expect(resp).toEqual(mockedResponse)
  })

  it('put negotiation fields', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })

    const token = 'Fake token'
    const negotiationId = 1
    const data = {} as NegotiationAPIResponse
    const resp = await putCounterNegotiationTerms(token, negotiationId, data)
    expect(resp).toEqual(mockedResponse)
  })

  it('get custom fitout options', async () => {
    const mockedResponse = {}
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: mockedResponse,
      })
    })

    const token = 'Fake token'
    const negotiationId = 1
    const resp = await getCustomFitout(token, negotiationId)
    expect(resp).toEqual(mockedResponse)
  })

  it('put custom fitout options', async () => {
    const data: FitoutOptionProps = {
      name: 'test',
      description: 'test description',
      amount: 5000,
    }
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: data,
      })
    })
    const token = 'Fake token'
    const negotiationId = 1
    const resp = await putCustomFitout(token, negotiationId, data)
    expect(resp).toEqual(data)
  })

  it('save special provision', async () => {
    const data = 'test'
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: data,
      })
    })
    const token = 'Fake token'
    const negotiationId = 1
    const resp = await saveSpecialProvision(token, negotiationId, data)
    expect(resp).toEqual(data)
  })
  it('accept special provision', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = 1
    const resp = await acceptSpecialProvision(token, negotiationId)
    expect(resp).toEqual({})
  })
  it('reject special provision', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = 1
    const resp = await rejectSpecialProvision(token, negotiationId)
    expect(resp).toEqual({})
  })
  it('select Fitout', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = '1'
    const data = {} as SelectedFitoutOption
    const resp = await selectFitoutAPI(token, negotiationId, data)
    expect(resp).toEqual({})
  })
  it('delete Fitout', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.delete.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = '1'
    const fitoutId = '1'
    const data = {} as SelectedFitoutOption
    const resp = await deleteFitoutAPI(token, negotiationId, fitoutId)
    expect(resp).toEqual(data)
  })

  it('get negotiationstatus', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = '1'
    const resp = await getNegotiationStatus(token, negotiationId)
    expect(resp).toEqual({})
  })
  it('Put sign lease status', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = '1'
    const status = { signLeaseStatus: NegotiationStatus.PreviewStart }
    const data = {}
    const resp = await putSignLeaseStatusAPI(token, negotiationId, status)
    expect(resp).toEqual(data)
  })
  it('post signer info', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = '1'
    const dataSignerInfo = {
      id: 'test1',
      name: 'test2',
      emailId: 'test3',
      companyName: 'test4',
      companyNumber: 'test5',
    }
    const data = {}
    const resp = await postSignerInfo(token, negotiationId, dataSignerInfo)
    expect(resp).toEqual(data)
  })
  it('put signer info', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.put.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const dataSignerInfo = {
      id: 'test1',
      name: 'test2',
      emailId: 'test3',
      companyName: 'test4',
      companyNumber: 'test5',
    }
    const data = {}
    const resp = await putSignerInfo(token, dataSignerInfo)
    expect(resp).toEqual(data)
  })
  it('get signer info', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = '1'

    const data = {}
    const resp = await getSignerInfo(token, negotiationId)
    expect(resp).toEqual(data)
  })
  it('accept lease', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const negotiationId = '1'

    const data = {}
    const resp = await acceptLease(token, negotiationId)
    expect(resp).toEqual(data)
  })
  it('final sign', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const enquiryId = '1'

    const data = {}
    const resp = await finalSign(token, enquiryId)
    expect(resp).toEqual(data)
  })
  it('final sign', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(() => {
      return Promise.resolve({
        data: {},
      })
    })
    const token = 'Fake token'
    const enquiryId = '1'
    const dataCulture = { culture: 'en-GB' }

    const data = {}
    const resp = await getPreviewLeaseSagaAPI(token, enquiryId, dataCulture)
    expect(resp).toEqual(data)
  })
})
