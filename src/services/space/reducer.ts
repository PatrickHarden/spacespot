import constants from './constants'
import {
  SpaceAction,
  SpaceState,
  SpaceSearchResponse,
  SpaceGetResponse,
} from './types'
import { get } from 'lodash'
import { AmenityOptions } from 'services/onboarding/types'

const initialState: SpaceState = {}

const reducer = (
  state: SpaceState = initialState,
  action: SpaceAction,
): SpaceState => {
  switch (action.type) {
    case constants.SEARCH_SUCCESS:
      return { ...state, search: action.payload as SpaceSearchResponse }
    case constants.SEARCH_ERROR:
      return { ...state, search: { error: action.payload as string } }
    case constants.GET_SUCCESS:
      return { ...state, item: action.payload as SpaceGetResponse }
    case constants.GET_SELECTED_SPACE_SUCCESS:
      return { ...state, selectedSpace: action.payload as SpaceGetResponse }
    case constants.GET_PARENT_SPACE_SUCCESS:
      return { ...state, parentSpace: action.payload as SpaceGetResponse }
    case constants.GET_AMENITIES_SUCCESS:
      return { ...state, regionAmenities: action.payload as AmenityOptions }
    case constants.GET_SPACE_SUCCESS:
      return {
        ...state,
        items: {
          ...get(state, 'items', {}),
          [get(
            action,
            'payload["Common.PrimaryKey"]',
            0,
          )]: action.payload as SpaceGetResponse,
        },
      }
    case constants.GET_ERROR:
      return { ...state, item: { error: action.payload as string } }
    default:
      return state
  }
}
export default reducer
