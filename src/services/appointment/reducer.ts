import constants from './constants'
import { AppointmentAction, AppointmentState, Appointment } from './types'

const initialState: AppointmentState = {}

const reducer = (
  state: AppointmentState = initialState,
  action: AppointmentAction,
): AppointmentState => {
  switch (action.type) {
    case constants.GET_ERROR:
      return { ...state, error: action.payload as string }
    case constants.GET_SUCCESS:
      return { ...state, data: action.payload as Array<Appointment> }
    case constants.CREATE_SUCCESS:
      return {
        ...state,
        data: [...(state.data || []), action.payload as Appointment],
      }
    default:
      return state
  }
}
export default reducer
