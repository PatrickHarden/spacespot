import {
  call,
  put,
  takeLatest,
  takeLeading,
  select,
  take,
} from 'redux-saga/effects'
import userSelectors from '../user/selectors'
import enquirySelectors from '../enquiry/selectors'
import selectors from './selectors'
import enquiryConstants from 'services/enquiry/constants'
import actions from './actions'
import constants from './constants'
import toaster from 'services/toaster/actions'
import Analytics from 'services/analytics'
import { getUserIntl } from 'intl'

import {
  NegotiationAPIResponse,
  FitoutOptionProps,
  SelectedFitoutOption,
  NegotiationStatus,
  SignerInfoDTO,
} from './types'

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
  postSignerInfo,
  putSignerInfo,
  getSignerInfo,
  finalSign,
  acceptLease,
  getSigners,
  getPreviewLeaseSagaAPI,
  getLeaseDocument,
} from './api'

export function* getNegotiationTermsSaga() {
  try {
    let enquiryId = yield select(enquirySelectors.getEnquiryId)
    if (!enquiryId) {
      yield take(enquiryConstants.GET_SUCCESS)
      enquiryId = yield select(enquirySelectors.getEnquiryId)
    }
    const token = yield select(userSelectors.token)

    const resp: NegotiationAPIResponse = yield call(
      getNegotiationTerms,
      token,
      enquiryId,
    )
    yield put(actions.getSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.getError(e.message))
  }
}

export function* getNegotiationTermsFieldsSaga() {
  try {
    const token = yield select(userSelectors.token)

    const resp = yield call(getNegotiationTermsFields, token)
    yield put(actions.getFieldsSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.getFieldsError(e.message))
  }
}

export function* putCounterNegotiationTermsSaga(action: any) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(enquirySelectors.getEnquiryId)
    // yield call(acceptEnquiry, enquiryId, token)
    const terms = { terms: action.payload }
    const resp = yield call(putCounterNegotiationTerms, token, enquiryId, terms)
    yield put(actions.putCounterSuccess(resp))
    yield call(getNegotiationTermsSaga)
    Analytics.pixel(Analytics.PIXELS.NEGOTIATION_SUBMITTED)
    return resp
  } catch (e) {
    yield put(actions.putCounterError(e.message))
  }
}

export function* acceptNegotiationTermsSaga() {
  try {
    const token = yield select(userSelectors.token)

    const enquiryId = yield select(enquirySelectors.getEnquiryId)

    const resp = yield call(acceptNegotiationTerms, token, enquiryId)
    yield put(actions.acceptSuccess(resp))
    yield put(actions.get())
    return resp
  } catch (e) {
    yield put(actions.acceptError(e.message))
  }
}

export function* rejectNegotiationTermsSaga() {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(enquirySelectors.getEnquiryId)

    const resp = yield call(rejectNegotiationTerms, token, enquiryId)
    yield put(actions.rejectSuccess(resp))
    yield put(actions.get())
    return resp
  } catch (e) {
    yield put(actions.rejectError(e.message))
  }
}

export function* customFitoutSaga() {
  try {
    const token = yield select(userSelectors.token)
    let negotiationId = yield select(selectors.getNegotiationId)
    if (!negotiationId) {
      yield take(constants.GET_SUCCESS)
      negotiationId = yield select(selectors.getNegotiationId)
    }
    const resp = yield call(getCustomFitout, token, negotiationId)
    yield put(actions.getCustomFitoutSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.getCustomFitoutError(e.message))
  }
}

export function* putCustomFitoutSaga(action: {
  type: string
  payload: FitoutOptionProps
}) {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const resp = yield call(
      putCustomFitout,
      token,
      negotiationId,
      action.payload,
    )
    yield put(actions.putCustomFitoutSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.putCustomFitoutError(e.message))
  }
}

export function* saveSpecialProvisionSaga(action: {
  type: string
  payload: string
}) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(enquirySelectors.getEnquiryId)
    const resp = yield call(
      saveSpecialProvision,
      token,
      enquiryId,
      action.payload,
    )
    yield put(actions.saveSpecialProvisionsSuccess())
    yield put(actions.get())
    return resp
  } catch (e) {
    yield put(actions.saveSpecialProvisionsError(e.message))
  }
}
export function* acceptSpecialProvisionSaga() {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const resp = yield call(acceptSpecialProvision, token, negotiationId)
    yield put(actions.saveSpecialProvisionsSuccess())
    yield put(actions.get())
    return resp
  } catch (e) {
    yield put(actions.saveSpecialProvisionsError(e.message))
  }
}
export function* rejectSpecialProvisionSaga() {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const resp = yield call(rejectSpecialProvision, token, negotiationId)
    yield put(actions.saveSpecialProvisionsSuccess())
    yield put(actions.get())
    return resp
  } catch (e) {
    yield put(actions.saveSpecialProvisionsError(e.message))
  }
}
export function* selectFitoutSaga(action: {
  type: string
  payload: SelectedFitoutOption
}) {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const { payload } = action
    const resp = yield call(selectFitoutAPI, token, negotiationId, payload)
    yield put(actions.selectFitoutSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.selectFitoutError(e.message))
  }
}
export function* deleteFitoutSaga(action: { type: string; payload: string }) {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const { payload } = action
    const resp = yield call(deleteFitoutAPI, token, negotiationId, payload)
    yield put(actions.deleteFitoutSuccess(payload))
    return resp
  } catch (e) {
    yield put(actions.deleteFitoutError(e.message))
  }
}

export function* putSignLeaseStatusSaga(action: {
  type: string
  payload: NegotiationStatus
}) {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const { payload } = action
    const resp = yield call(putSignLeaseStatusAPI, token, negotiationId, {
      signLeaseStatus: payload,
    })
    yield put(actions.putNegotiationStatusSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.putNegotiationStatusError(e.message))
  }
}

export function* postSignerInfoSaga(action: {
  type: string
  payload: SignerInfoDTO
}) {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const { payload } = action
    const resp = yield call(postSignerInfo, token, negotiationId, payload)
    yield put(actions.signerInfoSuccess(resp))
    yield put(actions.putNegotiationStatus(NegotiationStatus.AcceptLease))
    return resp
  } catch (e) {
    yield put(actions.signerInfoError(e.message))
  }
}

export function* putSignerInfoSaga(action: {
  type: string
  payload: SignerInfoDTO
}) {
  try {
    const token = yield select(userSelectors.token)
    const { payload } = action
    const resp = yield call(putSignerInfo, token, payload)
    yield put(actions.signerInfoSuccess(resp))
    yield put(actions.putNegotiationStatus(NegotiationStatus.AcceptLease))
    return resp
  } catch (e) {
    yield put(actions.signerInfoError(e.message))
  }
}

export function* getSignerInfoSaga() {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const resp = yield call(getSignerInfo, token, negotiationId)
    yield put(actions.signerInfoSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.signerInfoError(e.message))
  }
}

export function* acceptLeaseSaga() {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const enquiryId = yield select(enquirySelectors.getEnquiryId)
    yield call(acceptLease, token, negotiationId)
    yield put(actions.putNegotiationStatus(NegotiationStatus.LeaseAccepted))

    const negotiation = yield call(getNegotiationTerms, token, enquiryId)
    yield put(actions.getSuccess(negotiation))
    const peerStatus = yield select(selectors.getNegotiationPeerStatus)
    if (peerStatus === NegotiationStatus.LeaseAccepted) {
      yield call(finalSign, token, enquiryId)
      yield put(
        actions.putNegotiationStatus(NegotiationStatus.LeaseSignInitiated),
      )
    }
    Analytics.pixel(Analytics.PIXELS.ACCEPT_LEASE)
    return negotiation
  } catch (e) {
    const intl = getUserIntl()
    yield put(actions.putNegotiationStatus(NegotiationStatus.AcceptLease))
    yield put(actions.signerInfoError(e.message))
    yield put(toaster.showError(intl.formatMessage({ id: 'SIGNING_KO' })))
  }
}

export function* getSignersSaga() {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    if (!negotiationId) {
      return null
    }
    const resp = yield call(getSigners, token, negotiationId)
    yield put(actions.signersSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.signersError(e.message))
  }
}

export function* getPreviewLeaseSaga() {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = yield select(enquirySelectors.getEnquiryId)
    const documentCulture = yield select(selectors.getDocumentCulture)
    const resp = yield call(getPreviewLeaseSagaAPI, token, enquiryId, {
      culture: documentCulture,
    })

    const pdfFile = new Blob([resp], {
      type: 'application/pdf',
    })
    const url = URL.createObjectURL(pdfFile)
    window.open(url)

    yield put(actions.putNegotiationStatusSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.putNegotiationStatusError(e.message))
  }
}

export function* getLeaseDocumentSaga() {
  try {
    const token = yield select(userSelectors.token)
    const negotiationId = yield select(selectors.getNegotiationId)
    const resp = yield call(getLeaseDocument, token, negotiationId)

    const pdfFile = new Blob([resp], {
      type: 'application/pdf',
    })
    const url = URL.createObjectURL(pdfFile)
    window.open(url)
    yield put(actions.putNegotiationStatusSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.putNegotiationStatusError(e.message))
  }
}

function* saga() {
  yield takeLatest(constants.GET, getNegotiationTermsSaga)
  yield takeLeading(constants.GET_FIELDS, getNegotiationTermsFieldsSaga)
  yield takeLatest(constants.PUT_COUNTER, putCounterNegotiationTermsSaga)
  yield takeLatest(constants.ACCEPT, acceptNegotiationTermsSaga)
  yield takeLatest(constants.REJECT, rejectNegotiationTermsSaga)
  yield takeLatest(constants.GET_CUSTOM_FITOUT, customFitoutSaga)
  yield takeLatest(constants.PUT_CUSTOM_FITOUT, putCustomFitoutSaga)
  yield takeLatest(constants.SAVE_SPECIAL_PROVISIONS, saveSpecialProvisionSaga)
  yield takeLatest(
    constants.ACCEPT_SPECIAL_PROVISIONS,
    acceptSpecialProvisionSaga,
  )
  yield takeLatest(
    constants.REJECT_SPECIAL_PROVISIONS,
    rejectSpecialProvisionSaga,
  )
  yield takeLatest(constants.SELECT_FITOUT, selectFitoutSaga)
  yield takeLatest(constants.DELETE_FITOUT, deleteFitoutSaga)
  yield takeLatest(constants.PUT_SIGN_LEASE_STATUS, putSignLeaseStatusSaga)
  yield takeLatest(constants.POST_SIGNER_INFO, postSignerInfoSaga)
  yield takeLatest(constants.PUT_SIGNER_INFO, putSignerInfoSaga)
  yield takeLatest(constants.GET_SIGNER_INFO, getSignerInfoSaga)
  yield takeLatest(constants.ACCEPT_LEASE, acceptLeaseSaga)
  yield takeLeading(constants.SIGNERS, getSignersSaga)
  yield takeLatest(constants.GET_PREVIEW_LEASE, getPreviewLeaseSaga)
  yield takeLatest(constants.GET_LEASE_DOC, getLeaseDocumentSaga)
}

export default saga
