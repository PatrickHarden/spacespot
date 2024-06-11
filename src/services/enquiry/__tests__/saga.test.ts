import { select, call, put, take } from 'redux-saga/effects'

import { FileItem } from 'services/global/types'
import userSelectors from 'services/user/selectors'
import toaster from 'services/toaster/actions'
import selectors from '../selectors'
import actions from '../actions'
import {
  initEnquiry,
  getEnquiry,
  getDocuments,
  putDocument,
  getDocument,
  deleteDocument,
} from '../api'
import {
  initEnquirySaga,
  getEnquirySaga,
  getDocsSaga,
  putDocSaga,
  getDocSaga,
  delDocSaga,
} from '../saga'
import { DocumentDTO, EnquiryRequest } from '../types'
import userConstants from 'services/user/constants'

type AnyGen = Generator<void, any, any>

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: jest.fn(),
}))

jest.spyOn(Date, 'now').mockImplementation(() => 0)

describe('Enquiry sagas', () => {
  it('initEnquirySaga should work', async () => {
    const request: EnquiryRequest = {
      spaceId: 'SPACE_1',
      message: 'NA',
      negotiation: {
        flexible: true,
        terms: [],
      },
    }
    const gen = initEnquirySaga(actions.init(request)) as AnyGen
    const token = '123'
    const reply: any = {}
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(initEnquiry, token, request))
    expect(gen.next(reply).value).toEqual(put(actions.initSuccess(reply)))
    expect(gen.next().value).toEqual(
      put(toaster.showSuccess('SUCCESS_CREATE_ENQUIRY')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('initEnquirySaga should fail', async () => {
    const request: EnquiryRequest = {
      spaceId: 'SPACE_1',
      message: 'NA',
      negotiation: {
        flexible: true,
        terms: [],
      },
    }
    const gen = initEnquirySaga(actions.init(request)) as AnyGen
    const token = '123'
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(initEnquiry, token, request))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(toaster.showError('ERROR_CREATE_ENQUIRY')),
    )
    expect(gen.next().value).toEqual(put(actions.initError('Error1')))
    expect(gen.next().done).toEqual(true)
  })

  it('getEnquirySaga should work', async () => {
    const gen = getEnquirySaga(actions.get('138')) as AnyGen
    const token = '123'
    const reply: any = {}
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(getEnquiry, '138', token))
    expect(gen.next(reply).value).toEqual(put(actions.getSuccess(reply)))
    expect(gen.next().done).toEqual(true)
  })

  it('getEnquirySaga should wait login', async () => {
    const gen = getEnquirySaga(actions.get('138')) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(null).value).toEqual(take(userConstants.LOGIN_SUCCESS))
    expect(gen.next().value).toEqual(select(userSelectors.token))
  })

  it('getEnquirySaga should fail', async () => {
    const token = '123'
    const gen = getEnquirySaga(actions.get('138')) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(getEnquiry, '138', token))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.getError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  const token = '123'
  const enqId = 138
  const docs = [] as Array<DocumentDTO>
  const item: FileItem = {
    key: 1,
    name: 'name',
    type: 'pdf',
    uri: 'uri',
  }
  const doc: DocumentDTO = {
    fileId: 1,
    fileName: 'test',
    enquireId: enqId,
    uploadedBy: 'user',
    uploadAt: new Date('2020/01/01'),
  }

  it('getDocsSaga should work', async () => {
    const gen = getDocsSaga(actions.getDocs(enqId)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(getDocuments, enqId, token))
    expect(gen.next(docs).value).toEqual(put(actions.getDocsSuccess(docs)))
    expect(gen.next().done).toEqual(true)
  })

  it('getDocsSaga should fail', async () => {
    const gen = getDocsSaga(actions.getDocs(enqId)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(getDocuments, enqId, token))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.getDocsError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('putDocSaga should work', async () => {
    const gen = putDocSaga(actions.putDoc(item)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getEnquiryId))
    expect(gen.next(enqId).value).toEqual(call(putDocument, item, enqId, token))
    expect(gen.next(doc).value).toEqual(put(actions.putDocSuccess(doc)))
    expect(gen.next().done).toEqual(true)
  })

  it('putDocSaga should fail', async () => {
    const gen = putDocSaga(actions.putDoc(item)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getEnquiryId))
    expect(gen.next(enqId).value).toEqual(call(putDocument, item, enqId, token))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.putDocError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('getDocSaga should work', async () => {
    window.URL.createObjectURL = jest.fn()
    const blob = new Blob([])
    const gen = getDocSaga(actions.getDoc(doc)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getEnquiryId))
    expect(gen.next(enqId).value).toEqual(
      call(getDocument, doc.fileId, enqId, token),
    )
    expect(gen.next(blob).value).toEqual(
      put(actions.getDocSuccess(doc.fileName)),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('getDocSaga should fail', async () => {
    window.URL.createObjectURL = jest.fn()
    const gen = getDocSaga(actions.getDoc(doc)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getEnquiryId))
    expect(gen.next(enqId).value).toEqual(
      call(getDocument, doc.fileId, enqId, token),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.getDocError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('delDocSaga should work', async () => {
    const gen = delDocSaga(actions.deleteDoc(doc.fileId)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getEnquiryId))
    expect(gen.next(enqId).value).toEqual(
      call(deleteDocument, doc.fileId, enqId, token),
    )
    expect(gen.next().value).toEqual(put(actions.deleteDocSuccess(doc.fileId)))
    expect(gen.next().done).toEqual(true)
  })

  it('delDocSaga should fail', async () => {
    const gen = delDocSaga(actions.deleteDoc(doc.fileId)) as AnyGen
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getEnquiryId))
    expect(gen.next(enqId).value).toEqual(
      call(deleteDocument, doc.fileId, enqId, token),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.deleteDocError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
})
