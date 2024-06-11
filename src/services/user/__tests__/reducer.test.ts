import * as Msal from 'msal'
import reducer from '../reducer'
import actions from '../actions'
import { UserAction } from '../types'

describe('User reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as UserAction)).toEqual({
      language: 'en',
      locale: 'en-US',
      loading: true,
    })
  })

  it('init should return the initial state', () => {
    expect(reducer(undefined, actions.loginInit())).toEqual({
      language: 'en',
      locale: 'en-US',
      loading: true,
    })
  })

  it('should update login info', () => {
    const fakeAuthResponse = {
      idToken: { rawIdToken: '' },
    } as Msal.AuthResponse
    expect(reducer(undefined, actions.loginSuccess(fakeAuthResponse))).toEqual({
      auth: fakeAuthResponse,
      token: '',
      loading: false,
      language: 'en',
      locale: 'en-US',
    })
  })

  it('should update login error', () => {
    expect(reducer(undefined, actions.loginError('Testing'))).toEqual({
      error: 'Testing',
      loading: false,
      language: 'en',
      locale: 'en-US',
    })
  })
})
