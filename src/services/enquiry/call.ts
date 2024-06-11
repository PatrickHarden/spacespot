import { put, select, take } from 'redux-saga/effects'
import actions from './actions'
import selectors from './selectors'
import constants from './constants'

export function* callSaga(idEnquiry: string) {
  yield put(actions.get(idEnquiry))
  yield take([constants.GET_SUCCESS, constants.GET_ERROR])
  return yield select(selectors.getError)
}
export function* callSagaDocs(idEnquiry: string) {
  yield put(actions.getDocs(Number(idEnquiry)))
  yield take([constants.GET_DOCS_SUCCESS, constants.GET_DOCS_ERROR])
  return yield select(selectors.getError)
}
