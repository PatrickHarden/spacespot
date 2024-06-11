import axios, { AxiosResponse } from 'axios'
import CONFIG from 'config'

export interface DistrictItem {
  district: string
  subdistrict: Array<{ id: number; name: string }>
}

export const getDistricts = async (
  token: string,
  country: string,
  city: string,
): Promise<Array<DistrictItem>> => {
  const url = `${CONFIG.API_HOST}/locationdetails/${country}/${city}`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.get(url, config)
  return resp.data
}
