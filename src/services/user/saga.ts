import {
  put,
  call,
  select,
  take,
  takeLatest,
  race,
  delay,
} from 'redux-saga/effects'

import Analytics from 'services/analytics'
import * as Msal from 'msal'

import constants from './constants'
import actions from './actions'
import selectors from './selectors'
import { getToken } from './token'

import {
  b2cLogin,
  b2cSignUp,
  acquireToken,
  initializeAuthentication,
  getAccount,
  logout,
  SCOPES,
} from './b2c'

import {
  createProfile,
  getProfileAvatar,
  postPhoto,
  getProfile,
  updateProfile,
} from './api'

import { UserAction, AvatarPostPayload, UserProfileDTO } from './types'

import { takeOneByOne } from './effects'

export function* login(action: UserAction) {
  try {
    const auth: Msal.AuthResponse = yield call(b2cLogin, action)
    yield put(actions.loginSuccess(auth))
  } catch (e) {
    yield put(actions.loginError(e.message))
  }
}

export function* signUp() {
  try {
    Analytics.pixel(Analytics.PIXELS.SIGNUP)
    const auth: Msal.AuthResponse = yield call(b2cSignUp)
    yield put(actions.loginSuccess(auth))
  } catch (e) {
    yield put(actions.loginError(e.message))
  }
}

export function* initAuth() {
  try {
    // First init auth: call handleRedirectCallback as required by MSAL
    // if login info is in localStorage then loginSuccess is dispatched
    initializeAuthentication()
    const token: string = yield select(selectors.token)
    const acc: Msal.Account = yield getAccount()
    if (acc && !token) {
      // console.log('Auth time:', new Date(Number(acc.idToken.auth_time) * 1000))
      // console.log('Expiration:', new Date(Number(acc.idToken.exp) * 1000))
      // If login info is in localStorage but there is no token,
      // then renew the token
      const { auth }: { auth: Msal.AuthResponse } = yield race({
        auth: call(acquireToken, SCOPES.APP),
        timeout: delay(10000),
      })
      if (auth) {
        yield put(actions.loginSuccess(auth))
      } else {
        // timeout
        yield put(actions.loginEnd())
      }
    } else {
      // fire action to continue
      yield put(actions.loginEnd())
    }
  } catch (e) {
    yield put(actions.loginError(e.message))
  }
}

export function* logoutUser() {
  yield call(logout)
}

export function* profileSaga() {
  try {
    const token = yield select(selectors.token)
    const emailId = yield select(selectors.email)
    if (!emailId) {
      // yield call(logout)
      return
    }
    let displayName = yield select(selectors.name)
    if (!displayName || displayName === 'unknown') {
      const emailv = emailId.split('@')
      displayName = emailv[0] ? emailv[0].replace(/[._]/g, ' ') : ''
    }
    const profile = yield call(createProfile, token, { displayName, emailId })
    const id = profile.userId
    yield put(actions.getProfileSuccess(id, profile))
  } catch (e) {
    // ignore profile error
  }
}

export function* checkTimeout() {
  let logged = true
  const popupTimeout = 15000 // msecs
  const sessionTimeout = 20 * 60 * 1000 // msecs
  while (logged) {
    logged = yield select(selectors.isLogged)
    if (!logged) break
    const exp: number = yield select(selectors.expirationTime)
    const remMillis = exp * 1000 - Date.now()
    const timeout = Math.min(sessionTimeout, remMillis > 0 ? remMillis : 0)
    const result = yield race({
      keep: take(constants.PING),
      timeout: delay(timeout),
    })
    if (result.timeout) {
      // Timeout: show popup
      yield put(actions.showSessionPopup(true))
      const popupResult = yield race({
        keep: take(constants.PING),
        timeout: delay(popupTimeout),
      })
      if (popupResult.timeout) {
        // Popup timeout
        yield put(actions.showSessionPopup(false))
        yield put(actions.logout())
        break
      } else {
        yield call(getToken)
      }
    } else {
      // Renew threshold (secs)
      const renewThreshold = 60
      const exp: number = yield select(selectors.expirationTime)
      const remSecs = exp - Date.now() / 1000
      if (remSecs < renewThreshold) {
        yield call(getToken)
      }
    }
  }
}

export function* getAvatarSaga(action: any) {
  const id = action.payload
  try {
    const avatar = yield select(selectors.avatar(id))
    if (avatar !== undefined) {
      return
    }
    const token = yield select(selectors.token)
    const blob: Blob = yield call(getProfileAvatar, token, id)
    const uri = URL.createObjectURL(blob)
    yield put(actions.getAvatarSuccess(id, uri))
  } catch (e) {
    yield put(actions.getAvatarError(id, e.message))
  }
}

export function* postAvatarSaga(action: UserAction) {
  try {
    const token = yield select(selectors.token)
    const payload = action.payload as AvatarPostPayload
    yield call(postPhoto, token, payload.uri, payload.name)
    yield put(actions.postAvatarSuccess(payload.uri))
  } catch (e) {
    yield put(actions.postAvatarError(e.message))
  }
}

export function* getProfileSaga(action: any) {
  try {
    const id = action.payload
    const token = yield select(selectors.token)
    const profile = yield call(getProfile, token, id)
    yield put(actions.getProfileSuccess(id, profile))
  } catch (e) {
    yield put(actions.getProfileError(e.message))
  }
}

export function* putProfileSaga(action: UserAction) {
  try {
    const token = yield select(selectors.token)
    const payload = action.payload as UserProfileDTO
    const profile = yield call(updateProfile, token, payload)
    yield put(actions.putProfileSuccess(profile))
  } catch (e) {
    yield put(actions.putProfileError(e.message))
  }
}

function* saga() {
  yield takeLatest(constants.AUTH_INIT, initAuth)
  yield takeLatest(constants.LOGIN_INIT, login)
  yield takeLatest(constants.LOGOUT, logoutUser)
  yield takeLatest(constants.SIGNUP, signUp)
  yield takeLatest(constants.LOGIN_SUCCESS, checkTimeout)
  yield takeLatest(constants.LOGIN_SUCCESS, profileSaga)
  yield takeOneByOne(constants.AVATAR_GET, getAvatarSaga)
  yield takeLatest(constants.AVATAR_POST, postAvatarSaga)
  // yield takeLatest(constants.PROFILE_GET, getProfileSaga)
  yield takeLatest(constants.PROFILE_PUT, putProfileSaga)
}

export default saga
