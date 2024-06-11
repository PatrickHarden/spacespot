import constants from './constants'
import {
  SpaceSearchResponse,
  SpaceGetResponse,
  FilterOptions,
  Space,
} from './types'
import { AmenityOptions } from 'services/onboarding/types'

const searchInit = (payload: FilterOptions) => ({
  type: constants.SEARCH_INIT,
  payload,
})
const searchSuccess = (payload: SpaceSearchResponse) => ({
  type: constants.SEARCH_SUCCESS,
  payload,
})
const searchError = (payload: any) => ({
  type: constants.SEARCH_ERROR,
  payload,
})

const getInit = () => ({
  type: constants.GET_INIT,
})
const getSuccess = (payload: SpaceGetResponse) => ({
  type: constants.GET_SUCCESS,
  payload,
})
const getError = (payload: any) => ({
  type: constants.GET_ERROR,
  payload,
})

const getSpace = (payload: string) => ({
  type: constants.GET_SPACE,
  payload,
})
const getSpaceSuccess = (payload: Space) => ({
  type: constants.GET_SPACE_SUCCESS,
  payload,
})

const getSpaceError = (payload: string) => ({
  type: constants.GET_SPACE_ERROR,
  payload,
})
const getSelectedSpace = (payload: string) => ({
  type: constants.GET_SELECTED_SPACE,
  payload,
})

const getSelectedSpaceSuccess = (payload: SpaceGetResponse) => ({
  type: constants.GET_SELECTED_SPACE_SUCCESS,
  payload,
})

const getSelectedSpaceError = (payload: string) => ({
  type: constants.GET_SELECTED_SPACE_ERROR,
  payload,
})

const getParentSpaceSuccess = (payload: SpaceGetResponse) => ({
  type: constants.GET_PARENT_SPACE_SUCCESS,
  payload,
})

const getAmenitiesSuccess = (payload: AmenityOptions) => ({
  type: constants.GET_AMENITIES_SUCCESS,
  payload,
})

export default {
  searchInit,
  searchSuccess,
  searchError,
  getInit,
  getSuccess,
  getError,
  getSpace,
  getSpaceSuccess,
  getSpaceError,
  getSelectedSpace,
  getSelectedSpaceSuccess,
  getSelectedSpaceError,
  getParentSpaceSuccess,
  getAmenitiesSuccess,
}
