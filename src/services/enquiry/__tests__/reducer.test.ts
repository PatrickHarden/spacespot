import reducer from '../reducer'
import actions from '../actions'
import {
  EnquiryAction,
  EnquiryResponse,
  EnquiryState,
  DocumentDTO,
} from '../types'

describe('Space reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as EnquiryAction)).toEqual({})
  })
  it('get success should update state', () => {
    const resp: EnquiryState = {} as EnquiryState
    expect(reducer(undefined, actions.init('1'))).toEqual(resp)
  })

  it('search error should update state', () => {
    const err = { error: 'Error1' }
    expect(reducer(undefined, actions.initError('Error1'))).toEqual(err)
  })

  it('get success should update state', () => {
    const resp: EnquiryResponse = {} as EnquiryResponse
    expect(reducer(undefined, actions.initSuccess(resp))).toEqual({
      data: resp,
    })
  })

  it('get docs', () => {
    const payload = [] as Array<DocumentDTO>
    expect(
      reducer(undefined, actions.getDocsSuccess(payload)),
    ).toMatchSnapshot()
  })

  it('put doc', () => {
    const doc1: DocumentDTO = {
      fileId: 1,
      fileName: 'test',
      enquireId: 1,
      uploadAt: new Date('2020/01/01'),
      uploadedBy: 'user1',
    }
    const state: EnquiryState = {
      docs: [doc1],
    }
    const payload = {} as DocumentDTO
    expect(reducer(state, actions.putDocSuccess(payload))).toMatchSnapshot()
    expect(reducer(undefined, actions.putDocSuccess(payload))).toMatchSnapshot()
  })

  it('delete doc', () => {
    const doc1: DocumentDTO = {
      fileId: 1,
      fileName: 'test',
      enquireId: 1,
      uploadAt: new Date('2020/01/01'),
      uploadedBy: 'user1',
    }
    const state: EnquiryState = {
      docs: [doc1],
    }
    const payload = 1
    expect(reducer(state, actions.deleteDocSuccess(payload))).toMatchSnapshot()
    expect(
      reducer(undefined, actions.deleteDocSuccess(payload)),
    ).toMatchSnapshot()
  })

  it('delete doc error', () => {
    const payload = 'Delete Doc Error'
    expect(
      reducer(undefined, actions.deleteDocError(payload)),
    ).toMatchSnapshot()
  })
})
