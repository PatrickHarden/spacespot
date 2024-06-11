import { get } from 'lodash'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import CONFIG from 'config'
import { dataURItoBlob } from 'services/global/util'

import { UserProfileDTO } from './types'

export const createProfile = async (
  token: string,
  userProfile: UserProfileDTO,
): Promise<UserProfileDTO> => {
  const url = `${CONFIG.API_HOST}/users/myprofile`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<UserProfileDTO> = await axios.post(
    url,
    userProfile,
    config,
  )
  return get(resp, 'data')
}

export const updateProfile = async (
  token: string,
  userProfile: UserProfileDTO,
): Promise<UserProfileDTO> => {
  const url = `${CONFIG.API_HOST}/users/myprofile`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<UserProfileDTO> = await axios.put(
    url,
    userProfile,
    config,
  )
  return get(resp, 'data')
}

export const getProfileAvatar = async (
  token: string,
  userId: string,
): Promise<Blob> => {
  const url = `${CONFIG.API_HOST}/users/myprofile/avatar/${userId}`
  const config: AxiosRequestConfig = {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${token}` },
  }
  const resp: AxiosResponse<Blob> = await axios.get(url, config)
  return get(resp, 'data')
}

export const getProfile = async (
  token: string,
  userId: string,
): Promise<UserProfileDTO> => {
  const url = `${CONFIG.API_HOST}/users/myprofile/${userId}`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<UserProfileDTO> = await axios.get(url, config)
  return get(resp, 'data')
}

export const postPhoto = async (
  token: string,
  uri: string,
  name: string,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/users/myprofile/avatar`
  const formData = new FormData()
  formData.append('file', dataURItoBlob(uri), name)
  const resp: AxiosResponse<any> = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return resp.data
}
