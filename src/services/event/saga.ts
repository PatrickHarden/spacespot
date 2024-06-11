import { call, put, takeLatest, select } from 'redux-saga/effects'
import userSelectors from '../user/selectors'
import actions from './actions'
import constants from './constants'
import { GetEnquiryEventsAction, EnquiryEvent } from './types'
import { getEnquiryEvents } from './api'

export function* getEnquiryEventsSaga(action: GetEnquiryEventsAction) {
  const id = action.payload.enquiryId
  try {
    const token = yield select(userSelectors.token)
    const resp: Array<EnquiryEvent> = yield call(getEnquiryEvents, token, id)
    yield put(actions.getSuccess(id, resp))
    return resp
  } catch (e) {
    yield put(actions.getError(id, e.message))
  }
}

function* saga() {
  yield takeLatest(constants.GET, getEnquiryEventsSaga)
}

export default saga
