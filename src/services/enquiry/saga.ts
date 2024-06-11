import { put, call, take, takeLatest, select } from 'redux-saga/effects'

import constants from './constants'
import actions from './actions'
import userActions from '../../services/user/actions'
import userSelectors from '../user/selectors'
import selectors from './selectors'
import userConstants from 'services/user/constants'
import { FileItem } from 'services/global/types'
import toaster from 'services/toaster/actions'
import Analytics from 'services/analytics'

import {
  EnquiryAction,
  EnquiryResponse,
  DocumentDTO,
  EnquiryRequest,
  EnquiryAPIResultActions,
} from './types'
import {
  initEnquiry,
  getEnquiry,
  getDocuments,
  putDocument,
  getDocument,
  deleteDocument,
  putDocumentType,
  getStandardTemplate,
  resetNotifications,
} from './api'
import history from 'browserhistory'
import { getUserIntl } from 'intl'

export function* initEnquirySaga(action: EnquiryAction) {
  const intl = getUserIntl()
  const request = action.payload as EnquiryRequest
  const apiResultActions: EnquiryAPIResultActions | undefined = Object.assign(
    {},
    request.apiResultActions,
  )
  try {
    const token: string = yield select(userSelectors.token)
    request.apiResultActions && delete request.apiResultActions
    const enquiry: EnquiryResponse = yield call(initEnquiry, token, request)
    yield put(actions.initSuccess(enquiry))
    yield put(
      toaster.showSuccess(intl.formatMessage({ id: 'SUCCESS_CREATE_ENQUIRY' })),
    )
    if (apiResultActions && apiResultActions.successSignInAfter) {
      yield put(userActions.loginInit('/enquiries'))
    }
    Analytics.pixel(Analytics.PIXELS.SEND_ENQUIRY)
  } catch (e) {
    if (
      apiResultActions &&
      apiResultActions.errorShowMessage &&
      apiResultActions.errorShowMessage.length > 0
    ) {
      yield put(toaster.showError(apiResultActions.errorShowMessage, 60000))
    } else {
      yield put(
        toaster.showError(intl.formatMessage({ id: 'ERROR_CREATE_ENQUIRY' })),
      )
    }
    yield put(actions.initError(e.message))
  }
}

export function* getEnquirySaga(action: EnquiryAction) {
  try {
    let token: string = yield select(userSelectors.token)
    if (!token) {
      yield take(userConstants.LOGIN_SUCCESS)
      token = yield select(userSelectors.token)
    }
    const enquiryId = action.payload as string
    const enquiry: EnquiryResponse = yield call(getEnquiry, enquiryId, token)
    yield put(actions.getSuccess(enquiry))
  } catch (e) {
    yield put(actions.getError(e.message))
    // on error redirect to home
    history.push('/')
  }
}

export function* resetNotificationsSaga(action: EnquiryAction) {
  try {
    let token: string = yield select(userSelectors.token)
    if (!token) {
      yield take(userConstants.LOGIN_SUCCESS)
      token = yield select(userSelectors.token)
    }
    const enquiryId = action.payload as number
    yield call(resetNotifications, enquiryId, token)
  } catch (e) {
    // ignore reset notifications error
  }
}

export function* getDocsSaga(action: EnquiryAction) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = action.payload as number
    const docs: Array<DocumentDTO> = yield call(getDocuments, enquiryId, token)
    yield put(actions.getDocsSuccess(docs))
  } catch (e) {
    yield put(actions.getDocsError(e.message))
  }
}

export function* putDocSaga(action: EnquiryAction) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(selectors.getEnquiryId)
    const item = action.payload as FileItem
    const doc: DocumentDTO = yield call(putDocument, item, enquiryId, token)
    const docSuccess = doc.uploadedBy
      ? doc
      : { ...doc, uploadedBy: yield select(userSelectors.accountIdentifier) }
    yield put(actions.putDocSuccess(docSuccess))
  } catch (e) {
    yield put(actions.putDocError(e.message))
  }
}

export function* putDocTypeSaga(action: EnquiryAction) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(selectors.getEnquiryId)
    const item = action.payload.item as FileItem
    const docType = action.payload.docType as string
    const doc: DocumentDTO = yield call(
      putDocumentType,
      item,
      enquiryId,
      token,
      docType,
    )
    const docSuccess = doc.uploadedBy
      ? doc
      : { ...doc, uploadedBy: yield select(userSelectors.accountIdentifier) }
    yield put(actions.putDocTypeSuccess(docSuccess))
  } catch (e) {
    yield put(actions.putDocError(e.message))
  }
}

function download(blob: Blob, fileName: string) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob)
    return
  }
  const objectUrl = URL.createObjectURL(blob)
  const el = document.createElement('a')
  el.setAttribute('href', objectUrl)
  el.setAttribute('download', fileName)
  el.style.display = 'none'
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

export function* getDocSaga(action: EnquiryAction) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(selectors.getEnquiryId)
    const doc = action.payload as DocumentDTO
    const docId = doc.fileId
    const text = yield call(getDocument, docId, enquiryId, token)
    download(text, doc.fileName)
    yield put(actions.getDocSuccess(doc.fileName))
  } catch (e) {
    yield put(actions.getDocError(e.message))
  }
}

export function* getStandardTemplateSaga() {
  try {
    const token = yield select(userSelectors.token)
    const text = yield call(getStandardTemplate, token)
    const fileName = 'SS_StandardTemplate.pdf'
    download(text, fileName)
    yield put(actions.getDocSuccess(fileName))
  } catch (e) {
    yield put(actions.getDocError(e.message))
  }
}

export function* delDocSaga(action: EnquiryAction) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(selectors.getEnquiryId)
    const docId = action.payload as number
    yield call(deleteDocument, docId, enquiryId, token)
    yield put(actions.deleteDocSuccess(docId))
  } catch (e) {
    yield put(actions.deleteDocError(e.message))
  }
}

function* saga() {
  yield takeLatest(constants.INIT, initEnquirySaga)
  yield takeLatest(constants.GET, getEnquirySaga)
  yield takeLatest(constants.GET_DOCS, getDocsSaga)
  yield takeLatest(constants.UPDATE_DOCS, getDocsSaga)
  yield takeLatest(constants.PUT_DOC, putDocSaga)
  yield takeLatest(constants.PUT_DOC_TYPE, putDocTypeSaga)
  yield takeLatest(constants.GET_DOC, getDocSaga)
  yield takeLatest(constants.DELETE_DOC, delDocSaga)
  yield takeLatest(constants.GET_STD_TEMPLATE, getStandardTemplateSaga)
  yield takeLatest(constants.RESET_NOTIFICATIONS, resetNotificationsSaga)
}

export default saga
