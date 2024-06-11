import { call, put, select, race, delay } from 'redux-saga/effects'
import * as Msal from 'msal'

import selectors from './selectors'
import actions from './actions'
import { acquireToken, SCOPES } from './b2c'

/**
 * Get or renew token
 *
 * To get/refresh the user token
 * replace in your saga:
 *   const token = yield select(userSelectors.token)
 * with:
 *   const token = yield call(getToken)
 */
export function* getToken() {
  try {
    const exp: number = yield select(selectors.expirationTime)
    const remSecs = exp - Date.now() / 1000
    if (remSecs > 60) {
      yield put(actions.ping())
      return yield select(selectors.token)
    } else {
      const { auth }: { auth: Msal.AuthResponse } = yield race({
        auth: call(acquireToken, SCOPES.APP),
        timeout: delay(10000),
      })
      if (auth) {
        yield put(actions.loginSuccess(auth))
        return yield select(selectors.token)
      } else {
        // timeout
        yield put(actions.loginEnd())
        return null
      }
    }
  } catch (e) {
    yield put(actions.loginError(e.message))
    return null
  }
}
