import * as Msal from 'msal'
import {
  UserAction,
  UserState,
  AvatarPayload,
  ProfilePayload,
  UserProfileDTO,
} from './types'
import constants from './constants'
import decodeJWT from 'jwt-decode'
import get from 'lodash/get'
import { getUserLocale, getUserLanguage, setUserLocale } from 'intl'

const initialState: UserState = {
  loading: true,
  locale: getUserLocale(),
  language: getUserLanguage(),
}

const decodeToken = (state: UserState, auth: Msal.AuthResponse): UserState => {
  const token = auth.idToken.rawIdToken
  const decodedToken = token ? decodeJWT(token) : undefined
  return { ...state, auth, token, decodedToken, loading: false }
}

const avatarSuccess = (state: UserState, action: UserAction) => {
  const payload = action.payload as AvatarPayload
  const avatars: { [key: string]: string | null } = { ...state.avatars }
  avatars[payload.userId] = payload.avatar
  return { ...state, avatars }
}

const avatarError = (state: UserState, action: UserAction) => {
  const payload = action.payload as AvatarPayload
  const avatars: { [key: string]: string | null } = { ...state.avatars }
  avatars[payload.userId] = null
  return { ...state, avatars }
}

const postAvatarSuccess = (state: UserState, action: UserAction) => {
  const userId = get(state, 'auth.account.accountIdentifier')
  const avatar = action.payload as string
  const avatars: { [key: string]: string | null } = { ...state.avatars }
  avatars[userId] = avatar
  return { ...state, avatars }
}

const profileSuccess = (state: UserState, action: UserAction) => {
  const payload = action.payload as ProfilePayload
  const profiles: { [key: string]: UserProfileDTO } = { ...state.profiles }
  profiles[payload.userId] = payload.profile
  return { ...state, profiles }
}

const putProfileSuccess = (state: UserState, action: UserAction) => {
  const userId = get(state, 'auth.account.accountIdentifier')
  const payload = action.payload as UserProfileDTO
  const profiles: { [key: string]: UserProfileDTO } = { ...state.profiles }
  profiles[userId] = payload
  return { ...state, profiles }
}

const changeLocale = (state: UserState, action: UserAction) => {
  const loc = action.payload as string
  const [locale, language] = setUserLocale(loc)
  return { ...state, locale, language }
}

const reducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case constants.LOGIN_INIT:
      return initialState
    case constants.LOGIN_ERROR:
      return { ...state, error: action.payload as string, loading: false }
    case constants.LOGIN_SUCCESS:
      return decodeToken(state, action.payload as Msal.AuthResponse)
    case constants.LOGIN_END:
      return { ...state, loading: false }
    case constants.SHOW_SESSION_POPUP:
      return { ...state, showSessionDialog: action.payload as boolean }
    case constants.AVATAR_GET_SUCCESS:
      return avatarSuccess(state, action)
    case constants.AVATAR_GET_ERROR:
      return avatarError(state, action)
    case constants.AVATAR_POST_SUCCESS:
      return postAvatarSuccess(state, action)
    case constants.PROFILE_GET_SUCCESS:
      return profileSuccess(state, action)
    case constants.PROFILE_PUT_SUCCESS:
      return putProfileSuccess(state, action)
    case constants.CHANGE_LOCALE:
      return changeLocale(state, action)
    default:
      return state
  }
}

export default reducer
