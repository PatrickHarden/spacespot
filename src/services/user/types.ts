import * as Msal from 'msal'

export interface AvatarPayload {
  userId: string
  avatar: string
}

export interface UserProfileDTO {
  displayName: string
  emailId: string
}

export interface ProfilePayload {
  userId: string
  profile: UserProfileDTO
}

export interface AvatarPostPayload {
  uri: string
  name: string
}

export interface UserAction {
  type: string
  payload?:
    | Msal.AuthResponse
    | string
    | boolean
    | AvatarPayload
    | AvatarPostPayload
    | ProfilePayload
    | UserProfileDTO
}

export interface UserState {
  error?: string
  auth?: Msal.AuthResponse
  token?: string
  decodedToken?: any
  loading: boolean
  showSessionDialog?: boolean
  avatars?: { [key: string]: string | null }
  profiles?: { [key: string]: UserProfileDTO }
  locale?: string
  language?: string
}
