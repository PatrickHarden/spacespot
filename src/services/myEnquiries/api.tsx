import { get } from 'lodash'
import axios, { AxiosResponse } from 'axios'
import { MyEnquiriesAPIResponse } from './types'
import CONFIG from 'config'

export const getMyEnquiriesAPI = async (
  token: string,
): Promise<Array<MyEnquiriesAPIResponse>> => {
  const url = `${CONFIG.API_HOST}/enquiries/myenquiries`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<Array<MyEnquiriesAPIResponse>> = await axios.get(
    url,
    config,
  )
  return get(resp, 'data')
}

export const acceptMyEnquiriesAPI = async (
  token: string,
  enquireId: string,
): Promise<MyEnquiriesAPIResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquireId}/accept`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<MyEnquiriesAPIResponse> = await axios.post(
    url,
    config,
  )
  return get(resp, 'data')
}

export const rejectMyEnquiriesAPI = async (
  token: string,
  enquireId: string,
): Promise<MyEnquiriesAPIResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquireId}/reject`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<MyEnquiriesAPIResponse> = await axios.post(
    url,
    config,
  )
  return get(resp, 'data')
}

export const cancelMyEnquiriesAPI = async (
  token: string,
  enquireId: string,
  feedback?: string,
): Promise<MyEnquiriesAPIResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquireId}/close`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const data = {
    feedback,
  }
  const resp: AxiosResponse<MyEnquiriesAPIResponse> = await axios.post(
    url,
    data,
    config,
  )
  return get(resp, 'data')
}

export const getNotificationCount = async (token: string): Promise<number> => {
  const url = `${CONFIG.API_HOST}/enquiries/notifications/count`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<number> = await axios.get(url, config)
  return get(resp, 'data')
}
