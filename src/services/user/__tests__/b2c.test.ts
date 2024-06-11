import {
  b2cLogin,
  acquireToken,
  logout,
  getAccount,
  initializeAuthentication,
  authCallback,
} from '../b2c'
import { getOrigin } from 'services/global/util'

import * as Msal from 'msal'

jest.mock('msal', () => ({
  getAccount: jest.fn(),
  acquireToken: jest.fn(),
  UserAgentApplication: class UserAgentApplicationMock {},
}))

Msal.UserAgentApplication.prototype.getAccount = jest.fn()
Msal.UserAgentApplication.prototype.loginRedirect = jest.fn()
Msal.UserAgentApplication.prototype.handleRedirectCallback = jest.fn()
Msal.UserAgentApplication.prototype.acquireTokenSilent = jest.fn()
Msal.UserAgentApplication.prototype.logout = jest.fn()

jest.mock('bootstrap/store', () => ({
  store: {
    dispatch: (obj: any) => {
      return obj
    },
  },
}))

describe('B2C', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Test B2C', async () => {
    initializeAuthentication()
    expect(
      Msal.UserAgentApplication.prototype.handleRedirectCallback,
    ).toHaveBeenCalled()
    expect(getOrigin()).toBe('http://localhost')
    getAccount()
    expect(Msal.UserAgentApplication.prototype.getAccount).toHaveBeenCalled()
    authCallback(undefined, { idToken: {} } as Msal.AuthResponse)
    authCallback({} as Msal.AuthError, undefined)
    acquireToken({})
    expect(
      Msal.UserAgentApplication.prototype.acquireTokenSilent,
    ).toHaveBeenCalled()
    b2cLogin()
    expect(Msal.UserAgentApplication.prototype.loginRedirect).toHaveBeenCalled()
    logout()
    expect(Msal.UserAgentApplication.prototype.logout).toHaveBeenCalled()
  })
})
