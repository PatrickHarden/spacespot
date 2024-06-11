import axios, { AxiosResponse } from 'axios'
import querystring from 'querystring'
import CONFIG from 'config'

export interface AmenityData {
  name: string
  description: string
}

export const getAmenities = async (
  region: string,
  locale: string,
): Promise<Array<AmenityData>> => {
  const url = `${CONFIG.API_HOST}/config/amenities?${querystring.stringify({
    region,
    locale,
  })}`
  const resp: AxiosResponse<Array<AmenityData>> = await axios.get(url)
  return resp.data
}
