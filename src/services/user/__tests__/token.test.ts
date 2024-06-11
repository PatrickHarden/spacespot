import { select, call, put, race, delay } from 'redux-saga/effects'
import * as Msal from 'msal'
import { getToken } from '../token'
import actions from '../actions'
import selectors from '../selectors'
import { acquireToken, SCOPES } from '../b2c'

describe('Token saga', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Test getToken OK', async () => {
    const gen = getToken() as Generator<void, any, any>
    const expTime = Date.now() / 1000 + 5000
    expect(gen.next().value).toEqual(select(selectors.expirationTime))
    expect(gen.next(expTime).value).toEqual(put(actions.ping()))
    expect(gen.next().value).toEqual(select(selectors.token))
  })

  it('Test getToken renew OK', async () => {
    const gen = getToken() as Generator<void, any, any>
    const expTime = Date.now() / 1000 - 5000
    expect(gen.next().value).toEqual(select(selectors.expirationTime))
    expect(gen.next(expTime).value).toEqual(
      race({
        auth: call(acquireToken, SCOPES.APP),
        timeout: delay(10000),
      }),
    )
    const auth = {} as Msal.AuthResponse
    expect(gen.next({ auth: auth, timeout: false }).value).toEqual(
      put(actions.loginSuccess(auth)),
    )
    expect(gen.next().value).toEqual(select(selectors.token))
  })

  it('Test getToken renew fail', async () => {
    const gen = getToken() as Generator<void, any, any>
    const expTime = Date.now() / 1000 - 5000
    expect(gen.next().value).toEqual(select(selectors.expirationTime))
    expect(gen.next(expTime).value).toEqual(
      race({
        auth: call(acquireToken, SCOPES.APP),
        timeout: delay(10000),
      }),
    )
    expect(gen.next({ auth: null, timeout: true }).value).toEqual(
      put(actions.loginEnd()),
    )
    expect(gen.next().value).toEqual(null)
    expect(gen.next().done).toEqual(true)
  })

  it('Test getToken exception', async () => {
    const gen = getToken() as Generator<void, any, any>
    const expTime = Date.now() / 1000 - 5000
    expect(gen.next().value).toEqual(select(selectors.expirationTime))
    expect(gen.next(expTime).value).toEqual(
      race({
        auth: call(acquireToken, SCOPES.APP),
        timeout: delay(10000),
      }),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.loginError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
})
