/* eslint-disable no-unused-vars */
import { SpacespotState } from '../global/types'
import { get } from 'lodash'
import { UserProfileDTO } from './types'
import { getUserLanguage, getUserLocale } from 'intl'

export const user = (state: SpacespotState) => get(state, 'user')
export const isLogged = (state: SpacespotState) =>
  get(state, 'user.auth') !== undefined
export const token = (state: SpacespotState) => get(state, 'user.token')
export const auth = (state: SpacespotState) => get(user(state), 'auth')
export const accountIdentifier = (state: SpacespotState) =>
  get(auth(state), 'account.accountIdentifier')

export const name = (state: SpacespotState) =>
  get(state, 'user.decodedToken.name')

const email = (state: SpacespotState) =>
  get(state, 'user.decodedToken.emails[0]')

const avatar = (id: string) => (state: SpacespotState): string =>
  get(state, `user.avatars[${id}]`)

const profile = (id: string) => (state: SpacespotState): UserProfileDTO =>
  get(state, `user.profiles[${id}]`)

export const isLandlord = (state: SpacespotState): boolean =>
  get(state, 'user.auth.idToken.claims.extension_Landlord', false)

export const isTenant = (state: SpacespotState): boolean =>
  isLogged(state) && !isLandlord(state)

export const isLoading = (state: SpacespotState): boolean =>
  get(state, 'user.loading', false)

export const isNewUser = (state: SpacespotState): boolean =>
  get(state, 'user.decodedToken.newUser')

export const expirationTime = (state: SpacespotState): number =>
  get(state, 'user.decodedToken.exp')

export const showSessionDialog = (state: SpacespotState): boolean =>
  get(state, 'user.showSessionDialog', false)

const getLanguage = (state: SpacespotState): string =>
  get(state, 'user.language', getUserLanguage())

const getLocale = (state: SpacespotState): string =>
  get(state, 'user.locale', getUserLocale())

const getGAUser = (state: SpacespotState) =>
  isLogged(state)
    ? { isLogged: true, isLandlord: isLandlord(state) }
    : { isLogged: false, isLandlord: undefined }

export default {
  user,
  isLogged,
  isLandlord,
  isTenant,
  isLoading,
  token,
  accountIdentifier,
  name,
  email,
  avatar,
  profile,
  isNewUser,
  expirationTime,
  showSessionDialog,
  getLanguage,
  getLocale,
  getGAUser,
}
