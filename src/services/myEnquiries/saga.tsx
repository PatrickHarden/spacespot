import { call, put, all, takeLatest, select } from 'redux-saga/effects'
import {
  getMyEnquiriesAPI,
  acceptMyEnquiriesAPI,
  rejectMyEnquiriesAPI,
  cancelMyEnquiriesAPI,
  getNotificationCount,
} from './api'
import { MyEnquiriesAPIResponse } from './types'
import constants from './constants'
import actions from './actions'
import userSelectors from 'services/user/selectors'
import userActions from 'services/user/actions'
import actionsSpace from 'services/space/actions'
import { getToken } from 'services/user/token'
import Analytics from 'services/analytics'

export function* getMyEnquiriesSaga() {
  try {
    const token = yield call(getToken)
    const isLandlord = yield select(userSelectors.isLandlord)

    const resp: Array<MyEnquiriesAPIResponse> = yield call(
      getMyEnquiriesAPI,
      token,
    )

    // update peer profile info
    yield all(
      resp
        .filter((enquiry: MyEnquiriesAPIResponse) => enquiry.otherPeerDetails)
        .map((enquiry: MyEnquiriesAPIResponse) => {
          const displayName = enquiry.otherPeerDetails.displayName || ''
          const id = isLandlord ? enquiry.peer1Id : enquiry.peer2Id
          return put(
            userActions.getProfileSuccess(id, { displayName, emailId: '' }),
          )
        }),
    )

    const spacesId = resp
      .map((enquiry: MyEnquiriesAPIResponse) => enquiry.spaceId)
      .filter(
        (item: string, pos: number, self: Array<string>) =>
          self.indexOf(item) === pos,
      )

    yield all(
      spacesId.map((spaceId: string) => put(actionsSpace.getSpace(spaceId))),
    )
    yield put(actions.getSuccess(resp))
    yield put(actions.getNotifications())
    return resp
  } catch (e) {
    yield put(actions.getError(e.message))
  }
}

export function* acceptMyEnquiriesSaga(action: any) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = action.payload

    const resp = yield call(acceptMyEnquiriesAPI, token, enquiryId)
    yield put(actions.acceptSuccess(resp))
    Analytics.pixel(Analytics.PIXELS.ACCEPT_ENQUIRY)
    return resp
  } catch (e) {
    yield put(actions.acceptError(e.message))
  }
}

export function* rejectMyEnquiriesSaga(action: any) {
  try {
    const token = yield select(userSelectors.token)
    const enquiryId = action.payload

    const resp = yield call(rejectMyEnquiriesAPI, token, enquiryId)
    yield put(actions.rejectSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.rejectError(e.message))
  }
}

export function* cancelMyEnquiriesSaga(action: any) {
  try {
    const token = yield select(userSelectors.token)
    const { enquiryId, feedback } = action.payload

    const resp = yield call(cancelMyEnquiriesAPI, token, enquiryId, feedback)
    yield put(actions.cancelSuccess(resp))
    return resp
  } catch (e) {
    yield put(actions.cancelError(e.message))
  }
}

export function* getNotificationsSaga() {
  try {
    const token = yield select(userSelectors.token)
    const cnt = yield call(getNotificationCount, token)
    yield put(actions.setNotifications(cnt))
    return cnt
  } catch (e) {
    yield put(actions.setNotifications(0))
  }
}

function* saga() {
  yield takeLatest(constants.GET, getMyEnquiriesSaga)
  yield takeLatest(constants.ACCEPT, acceptMyEnquiriesSaga)
  yield takeLatest(constants.REJECT, rejectMyEnquiriesSaga)
  yield takeLatest(constants.CANCEL, cancelMyEnquiriesSaga)
  yield takeLatest(constants.GET_NOTIFICATIONS, getNotificationsSaga)
}

export default saga
