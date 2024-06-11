import { put, select, take } from 'redux-saga/effects'
import actions from './actions'
import selectors from './selectors'
import constants from './constants'

export function* callSaga() {
  yield put(actions.getInit())
  yield take([constants.GET_SUCCESS, constants.GET_ERROR])
  return yield select(selectors.selectSpaceError)
}
