import * as Msal from 'msal'
import { UserAction, UserProfileDTO } from './types'
import constants from './constants'

const authInit = (): UserAction => ({
  type: constants.AUTH_INIT,
})

const loginInit = (payload?: string | undefined): UserAction => ({
  type: constants.LOGIN_INIT,
  payload,
})

const loginSuccess = (payload: Msal.AuthResponse): UserAction => ({
  type: constants.LOGIN_SUCCESS,
  payload,
})

const loginError = (payload: string): UserAction => ({
  type: constants.LOGIN_ERROR,
  payload,
})

const loginEnd = (): UserAction => ({
  type: constants.LOGIN_END,
})

const logout = (): UserAction => ({
  type: constants.LOGOUT,
})

const signUp = (): UserAction => ({
  type: constants.SIGNUP,
})

const ping = (): UserAction => ({
  type: constants.PING,
})

const showSessionPopup = (payload: boolean) => ({
  type: constants.SHOW_SESSION_POPUP,
  payload,
})

const getAvatar = (payload: string) => ({
  type: constants.AVATAR_GET,
  payload,
})

const getAvatarError = (userId: string, msg: string) => ({
  type: constants.AVATAR_GET_ERROR,
  payload: { userId, msg },
})

const getAvatarSuccess = (userId: string, avatar: string): UserAction => ({
  type: constants.AVATAR_GET_SUCCESS,
  payload: { userId, avatar },
})

const getProfile = (payload: string) => ({
  type: constants.PROFILE_GET,
  payload,
})

const getProfileSuccess = (
  userId: string,
  profile: UserProfileDTO,
): UserAction => ({
  type: constants.PROFILE_GET_SUCCESS,
  payload: { userId, profile },
})

const getProfileError = (payload: string) => ({
  type: constants.PROFILE_GET_ERROR,
  payload,
})

const postAvatar = (uri: string, name: string) => ({
  type: constants.AVATAR_POST,
  payload: { uri: uri, name: name },
})

const postAvatarSuccess = (payload: string): UserAction => ({
  type: constants.AVATAR_POST_SUCCESS,
  payload,
})

const postAvatarError = (payload: string) => ({
  type: constants.AVATAR_POST_ERROR,
  payload,
})

const putProfile = (payload: UserProfileDTO) => ({
  type: constants.PROFILE_PUT,
  payload,
})

const putProfileSuccess = (payload: UserProfileDTO) => ({
  type: constants.PROFILE_PUT_SUCCESS,
  payload,
})

const putProfileError = (payload: string) => ({
  type: constants.PROFILE_PUT_ERROR,
  payload,
})

const changeLocale = (payload: string) => ({
  type: constants.CHANGE_LOCALE,
  payload,
})

export default {
  authInit,
  loginInit,
  loginSuccess,
  loginError,
  loginEnd,
  logout,
  signUp,
  ping,
  showSessionPopup,
  getAvatar,
  getAvatarError,
  getAvatarSuccess,
  postAvatar,
  postAvatarSuccess,
  postAvatarError,
  getProfile,
  getProfileSuccess,
  getProfileError,
  putProfile,
  putProfileSuccess,
  putProfileError,
  changeLocale,
}
