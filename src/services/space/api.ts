import axios, { AxiosResponse } from 'axios'
import querystring from 'querystring'
import CONFIG from 'config'
import {
  SpaceGetResponse,
  SpaceSearchResponse,
  FilterOptions,
  SearchOptions,
} from './types'
import { getRegionSite } from 'services/global/region'

/*
const spaceSearchSelect = [
  'Dynamic.PrimaryImage',
  'Common.ActualAddress',
  'Common.Charges',
  'Common.NumberOfBedrooms',
  'Common.PrimaryKey',
  'Common.UsageType',
  'Common.Coordinate',
  'Common.Aspects',
  'Common.ListingCount',
  'Common.IsParent',
  'Common.ContactGroup',
  'Common.Highlights',
  'Common.Walkthrough',
  'Common.MinimumSize',
  'Common.MaximumSize',
  'Common.TotalSize',
  'Common.GeoLocation',
  'Common.Sizes',
  'Common.LongDescription',
]
*/

export const searchSpaces = async (
  options: SearchOptions,
): Promise<SpaceSearchResponse> => {
  const params: any = {
    Site: getRegionSite(),
    // RadiusType: getRegionRadiusType(),
    // CurrencyCode: getRegionCurrencyCode(),
    // Unit: getGLRegionSizeUnit(),
    // Interval: 'Monthly',
    // radius: '14.86464416853986',
    // 'Dynamic.LetUnderOffer': 'true,false',
    // Lat: '51.5073509',
    // Lon: '0.12775829999998223',
    // 'Common.Aspects': 'isLetting',
    PageSize: '180',
    Page: '1',
    // Sort: 'asc(_distance)',
    // 'Common.UsageType': 'Office',
    // _select: spaceSearchSelect.join(','),
  }
  if (options.isParent !== undefined) {
    params['Common.IsParent'] = options.isParent
  }
  if (options.landLord) {
    params['Common.BuildingOperatorID'] = options.landLord
  }
  if (options.parentProperty) {
    params['Common.ParentProperty'] = options.parentProperty
  }
  const url = `${
    CONFIG.GL_API_HOST
  }/propertylistings/query?${querystring.stringify(params)}`
  const resp: AxiosResponse<SpaceSearchResponse> = await axios.get(url)
  return resp.data
}

export const filterSpaces = async (
  options: FilterOptions,
): Promise<SpaceSearchResponse> => {
  const params: any = {
    Site: getRegionSite(),
    PageSize: '180',
    Page: '1',
  }
  if (options.isParent !== undefined) {
    params['Common.IsParent'] = options.isParent
  }
  if (options.filters) {
    const keys = Object.keys(options.filters)
    keys.forEach(key => {
      params[key] = options.filters[key]
    })
  }
  const url = `${
    CONFIG.GL_API_HOST
  }/propertylistings/query?${querystring.stringify(params)}`
  const resp: AxiosResponse<SpaceSearchResponse> = await axios.get(url)
  return resp.data
}

export const getSpace = async (spaceId: string): Promise<SpaceGetResponse> => {
  const params = {
    Site: 'all-spacespot',
  }
  const url = `${
    CONFIG.GL_API_HOST
  }/propertylisting/${spaceId}?${querystring.stringify(params)}`
  const resp: AxiosResponse<SpaceGetResponse> = await axios.get(url)
  return resp.data
}

export const search = async (params: any): Promise<SpaceSearchResponse> => {
  const nparams = {
    Site: 'all-spacespot',
    ...params,
  }
  const url = `${
    CONFIG.GL_API_HOST
  }/propertylistings/query?${querystring.stringify(nparams)}`
  const resp: AxiosResponse<SpaceSearchResponse> = await axios.get(url)
  return resp.data
}
