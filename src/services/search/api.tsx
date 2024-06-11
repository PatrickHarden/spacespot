import axios, { AxiosResponse } from 'axios'
import querystring from 'querystring'
import CONFIG from 'config'
import { SpaceGetResponse } from 'services/space/types'

export const getSearchSpaces = async (
  filterParams: any,
): Promise<Array<SpaceGetResponse>> => {
  const params = {
    Site: 'all-spacespot',
    PageSize: 180,
    Page: 1,
    'Common.IsParent': false,
    ...filterParams,
  }
  const url = `${
    CONFIG.GL_API_HOST
  }/propertylistings/query?${querystring.stringify(params)}`
  const resp: AxiosResponse<Array<SpaceGetResponse>> = await axios.get(url)
  return resp.data
}
