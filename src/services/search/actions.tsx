import constants from './constants'
import { FilterAction } from './types'
const searchInit = () => ({
  type: constants.SEARCH_INIT,
})

const searchSuccess = (payload: any) => ({
  type: constants.SEARCH_SUCCESS,
  payload,
})
const searchError = (payload: any) => ({
  type: constants.SEARCH_ERROR,
  payload,
})

const changeFilter = (payload: FilterAction) => ({
  type: constants.CHANGE_FILTER,
  payload,
})
const putURLParams = () => ({
  type: constants.PUT_URL_PARAMS,
})
export default {
  searchInit,
  searchSuccess,
  searchError,
  changeFilter,
  putURLParams,
}

// Common.UsageType: FlexOffice,
// Common.FloorsAndUnits.Common.AvailableFrom: 2020-04-03
// Common.FloorsAndUnits.Common.Areas.Common.MaxArea: 40

// Common.UsageType: Office
// Common.Availability.Common.AvailabilityDate: 2020-04-03
// Dynamic.MinDesks
