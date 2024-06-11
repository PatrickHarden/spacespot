import constants from './constants'
import { SearchState, SearchAction, FilterState, FilterAction } from './types'
import { SpaceSearchResponse } from 'services/space'

const initialState: SearchState = {
  filters: {
    where: { location: '' },
    desks: 0,
    when: '',
    type: undefined,
  },
}

const setFilter = (filters: FilterState, payload: FilterAction) => {
  const nval = {
    ...filters,
    [payload.type]: payload.data,
  }
  // strip some characters to avoid XSS attacks
  if (nval.where && nval.where.location) {
    const str = nval.where.location.replace(/[<>%=]/gi, '')
    nval.where.location = str
  }
  return nval
}

const reducer = (
  state: SearchState = initialState,
  action: SearchAction,
): SearchState => {
  switch (action.type) {
    case constants.SEARCH_SUCCESS:
      return { ...state, search: action.payload as SpaceSearchResponse }
    case constants.CHANGE_FILTER:
      return {
        ...state,
        filters: setFilter(
          state.filters as FilterState,
          action.payload as FilterAction,
        ),
      }

    default:
      return state
  }
}
export default reducer
