import axios, { AxiosResponse } from 'axios'
import * as Msal from 'msal'
import { get } from 'lodash'
import actions from './actions'
import { store } from 'bootstrap/store'
import { getOrigin } from 'services/global/util'
import Analytics from 'services/analytics'
import history from 'browserhistory'
import config from 'config'
import { popPage, pushPage } from './redirect'
import { getLangPrefix } from 'intl'
import { UserAction } from './types'

const GRAPH_SCOPES = {
  OPENID: 'openid',
  PROFILE: 'profile',
  USER_READ: 'User.Read.All',
  MAIL_READ: 'Mail.Read',
}

export const SCOPES = {
  LOGIN: {
    scopes: [GRAPH_SCOPES.OPENID, GRAPH_SCOPES.PROFILE],
  },
  EMAIL: {
    scopes: [GRAPH_SCOPES.MAIL_READ],
  },
  APP: {
    scopes: [config.B2C_CLIENT_ID],
  },
}

export const isIE = () => {
  const ua = window.navigator.userAgent
  const msie = ua.indexOf('MSIE ') > -1
  const msie11 = ua.indexOf('Trident/') > -1
  return msie || msie11
}

const msalApp = new Msal.UserAgentApplication({
  auth: {
    clientId: config.B2C_CLIENT_ID,
    authority: config.B2C_AUTHORITY,
    validateAuthority: false,
    redirectUri: getOrigin(),
    // postLogoutRedirectUri: 'http://localhost:3000',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: isIE(),
  },
  system: {
    navigateFrameWait: 0,
  },
})

export const authCallback = (
  error: Msal.AuthError | undefined,
  response: Msal.AuthResponse | undefined,
) => {
  if (response && response.idToken) {
    const loginSuccess = actions.loginSuccess(response)
    store.dispatch(loginSuccess)

    Analytics.event({
      category: 'User',
      action: 'user signed in successful',
      //value: userName
    })

    const uri = popPage()
    if (uri) {
      history.push(uri)
    } else if (get(response, 'idToken.claims.extension_Landlord', false)) {
      history.push(`${getLangPrefix()}/dashboard`)
    }
  }

  if (error) {
    store.dispatch(actions.loginError(error.message))
  }
}

export const initializeAuthentication = () => {
  msalApp.handleRedirectCallback(authCallback)
}

export const getAccount = () => msalApp.getAccount()

export const acquireToken = async (
  scopes: Msal.AuthenticationParameters,
): Promise<Msal.AuthResponse> => {
  return await msalApp.acquireTokenSilent(scopes)
}

export function b2cSignUp(): void {
  pushPage(window.location.pathname)
  msalApp.authority = config.B2C_AUTHORITY_SIGNUP
  return msalApp.loginRedirect(SCOPES.LOGIN)
}

export function b2cLogin(userAction?: UserAction): void {
  userAction && userAction.payload && typeof userAction.payload === 'string'
    ? pushPage(userAction.payload)
    : pushPage(window.location.pathname)
  return msalApp.loginRedirect(SCOPES.LOGIN)
}

export const logout = () => msalApp.logout()

export const b2cRegister = async (
  name: string,
  company: string,
  email: string,
  password: string,
): Promise<{ userId: string }> => {
  const data = {
    displayName: name,
    emailId: email,
    userType: 'Tenant',
    companyName: company,
    accessKey: password,
  }
  const url = `${config.API_HOST}/users/b2c/register`
  const pconfig = {
    headers: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      Authorization: 'U1BBQ0VTUE9UVVNFUlJFR0lTVFJBVElPTlM=',
    },
  }
  const resp: AxiosResponse<any> = await axios.post(url, data, pconfig)
  return resp.data
}
