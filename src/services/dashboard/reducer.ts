import constants from './constants'
import { DashboardState } from './types'

const initialState: DashboardState = {
  initOK: false,
  buildings: [],
  spaces: {},
  isLoading: false,
  pendingDelete: [],
}

const reducer = (
  state: DashboardState = initialState,
  action: any,
): DashboardState => {
  switch (action.type) {
    case constants.DASHBOARD_SUCCESS:
      return {
        ...state,
        buildings: action.payload.buildings,
        spaces: action.payload.spaces,
        isLoading: false,
        initOK: true,
      }
    case constants.DASHBOARD_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      }
    case constants.DASHBOARD_INIT:
      return {
        ...state,
        buildings: [],
        spaces: {},
        isLoading: true,
        pendingDelete: state.pendingDelete,
      }
    case constants.DASHBOARD_PENDING_SPACE_DELETE:
      return {
        ...state,
        pendingDelete: [...state.pendingDelete, action.payload as string],
      }
    default:
      return state
  }
}

export default reducer
