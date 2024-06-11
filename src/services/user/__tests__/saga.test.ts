import { select, take, call, put, race, delay } from 'redux-saga/effects'
import {
  initAuth,
  login,
  signUp,
  logoutUser,
  checkTimeout,
  profileSaga,
} from '../saga'
import actions from '../actions'
import constants from '../constants'
import selectors from '../selectors'
import { b2cLogin, acquireToken, b2cSignUp, logout } from '../b2c'
import { AuthResponse, AuthenticationParameters } from 'msal'
import { getToken } from '../token'
import { createProfile } from '../api'
import { UserAction } from '../types'

jest.mock('../b2c', () => ({
  initializeAuthentication: jest.fn(),
  getAccount: () => {
    return { app: {} }
  },
  b2cLogin: (userAction?: UserAction) => {
    return {}
  },
  b2cSignUp: () => {
    return {}
  },
  acquireToken: () => {
    return {}
  },
  logout: jest.fn(),
  SCOPES: {
    APP: {
      scopes: [],
    },
  },
}))

describe('User sagas', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Test renew token OK', async () => {
    const gen = initAuth() as Generator<void, any, any>
    const token = null
    const params = {
      scopes: [],
    } as AuthenticationParameters
    const account = { app: {} }
    const auth = {} as AuthResponse
    expect(gen.next().value).toEqual(select(selectors.token))
    expect(gen.next(token).value).toEqual(account)
    expect(gen.next(account).value).toEqual(
      race({ auth: call(acquireToken, params), timeout: delay(10000) }),
    )
    expect(gen.next({ auth: auth }).value).toEqual(
      put(actions.loginSuccess(auth)),
    )
  })

  it('Test renew token timeout', async () => {
    const gen = initAuth() as Generator<void, any, any>
    const token = null
    const params = {
      scopes: [],
    } as AuthenticationParameters
    const account = { app: {} }
    expect(gen.next().value).toEqual(select(selectors.token))
    expect(gen.next(token).value).toEqual(account)
    expect(gen.next(account).value).toEqual(
      race({ auth: call(acquireToken, params), timeout: delay(10000) }),
    )
    expect(gen.next({ timeout: true }).value).toEqual(put(actions.loginEnd()))
  })

  it('Test init existing token', async () => {
    const gen = initAuth() as Generator<void, any, any>
    const token = 'badtoken'
    const account = { app: {} }
    expect(gen.next().value).toEqual(select(selectors.token))
    expect(gen.next(token).value).toEqual(account)
    expect(gen.next(account).value).toEqual(put(actions.loginEnd()))
    expect(gen.next().done).toEqual(true)
  })

  it('Test renew token KO', async () => {
    const gen = initAuth() as Generator<void, any, any>
    const token = null
    const params = {
      scopes: [],
    } as AuthenticationParameters
    const account = { app: {} }
    expect(gen.next().value).toEqual(select(selectors.token))
    expect(gen.next(token).value).toEqual(account)
    expect(gen.next(account).value).toEqual(
      race({ auth: call(acquireToken, params), timeout: delay(10000) }),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.loginError('Error1')),
    )
  })

  it('Test login saga OK', async () => {
    const gen = login() as Generator<void, any, any>
    const auth = {}
    expect(gen.next().value).toEqual(call(b2cLogin, undefined))
    expect(gen.next(auth).value).toEqual(
      put(actions.loginSuccess(auth as AuthResponse)),
    )
  })

  it('Test login saga KO', async () => {
    const gen = login() as Generator<void, any, any>
    expect(gen.next().value).toEqual(call(b2cLogin, undefined))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.loginError('Error1')),
    )
  })
  it('Test signup saga OK', async () => {
    const gen = signUp() as Generator<void, any, any>
    const auth = {}
    expect(gen.next().value).toEqual(call(b2cSignUp))
    expect(gen.next(auth).value).toEqual(
      put(actions.loginSuccess(auth as AuthResponse)),
    )
  })
  it('Test signup saga KO', async () => {
    const gen = signUp() as Generator<void, any, any>
    expect(gen.next().value).toEqual(call(b2cSignUp))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.loginError('Error1')),
    )
  })
  it('Test logout', async () => {
    const gen = logoutUser() as Generator<void, any, any>
    expect(gen.next().value).toEqual(call(logout))
  })

  it('Create profile', async () => {
    const gen = profileSaga() as Generator<void, any, any>
    const token = '1'
    const name = 'me'
    const email = 'me@me.com'
    const profile = { displayName: name, emailId: email }
    expect(gen.next().value).toEqual(select(selectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.email))
    expect(gen.next(email).value).toEqual(select(selectors.name))
    expect(gen.next(name).value).toEqual(call(createProfile, token, profile))
  })

  it('Timeout: popup logout', async () => {
    const gen = checkTimeout() as Generator<void, any, any>
    const exp = 1000 + Date.now() / 1000
    const dtime = (jasmine.any(Number) as unknown) as number
    expect(gen.next().value).toEqual(select(selectors.isLogged))
    expect(gen.next(true).value).toEqual(select(selectors.expirationTime))
    expect(gen.next(exp).value).toEqual(
      race({ keep: take(constants.PING), timeout: delay(dtime) }),
    )
    expect(gen.next({ timeout: true }).value).toEqual(
      put(actions.showSessionPopup(true)),
    )
    expect(gen.next().value).toEqual(
      race({ keep: take(constants.PING), timeout: delay(15000) }),
    )
    expect(gen.next({ timeout: true }).value).toEqual(
      put(actions.showSessionPopup(false)),
    )
    expect(gen.next().value).toEqual(put(actions.logout()))
    expect(gen.next().done).toEqual(true)
  })

  it('Timeout: popup click', async () => {
    const gen = checkTimeout() as Generator<void, any, any>
    const exp = 1000 + Date.now() / 1000
    const dtime = (jasmine.any(Number) as unknown) as number
    expect(gen.next().value).toEqual(select(selectors.isLogged))
    expect(gen.next(true).value).toEqual(select(selectors.expirationTime))
    expect(gen.next(exp).value).toEqual(
      race({ keep: take(constants.PING), timeout: delay(dtime) }),
    )
    expect(gen.next({ timeout: true }).value).toEqual(
      put(actions.showSessionPopup(true)),
    )
    expect(gen.next().value).toEqual(
      race({ keep: take(constants.PING), timeout: delay(15000) }),
    )
    expect(gen.next({ timeout: false }).value).toEqual(call(getToken))
  })

  it('Timeout: ping', async () => {
    const gen = checkTimeout() as Generator<void, any, any>
    const exp = 30 + Date.now() / 1000
    const dtime = (jasmine.any(Number) as unknown) as number
    expect(gen.next().value).toEqual(select(selectors.isLogged))
    expect(gen.next(true).value).toEqual(select(selectors.expirationTime))
    expect(gen.next(exp).value).toEqual(
      race({ keep: take(constants.PING), timeout: delay(dtime) }),
    )
    expect(gen.next({ timeout: false }).value).toEqual(
      select(selectors.expirationTime),
    )
    expect(gen.next(exp).value).toEqual(call(getToken))
  })

  it('Timeout: not logged', async () => {
    const gen = checkTimeout() as Generator<void, any, any>
    expect(gen.next().value).toEqual(select(selectors.isLogged))
    expect(gen.next(false).done).toEqual(true)
  })
})
