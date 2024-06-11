import { get } from 'lodash'
import axios, { AxiosResponse } from 'axios'
import { EnquiryEvent } from './types'

import CONFIG from 'config'

export const getEnquiryEvents = async (
  token: string,
  enquiryId: string,
): Promise<Array<EnquiryEvent>> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/events`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<string> = await axios.get(url, config)
  return get(resp, 'data.events', [])
}

export const postViewEvent = async (
  token: string,
  parentId: string,
  type: string,
  city: string,
  district: string,
  subdistrict: string,
) => {
  const url = `${CONFIG.API_HOST}/eventmonitor/event`
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  const data = {
    eventCode: 'VIEW_SPACE',
    parentId: parentId,
    type: type,
    market: 'NO',
    city,
    district,
    subdistrict,
  }
  let repData = null
  try {
    const resp: AxiosResponse<string> = await axios.post(url, data, config)
    repData = get(resp, 'data')
  } catch (err) {
    // ignore
  }
  return repData
}
