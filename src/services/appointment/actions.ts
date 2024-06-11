import {
  AppointmentAction,
  Appointment,
  EditAppointment,
  NewAppointment,
} from './types'
import constants from './constants'

const get = (): AppointmentAction => ({
  type: constants.GET,
})
const getSuccess = (payload: Array<Appointment>) => ({
  type: constants.GET_SUCCESS,
  payload,
})
const getError = (payload: string): AppointmentAction => ({
  type: constants.GET_ERROR,
  payload,
})
const update = (): AppointmentAction => ({
  type: constants.UPDATE,
})

const create = (payload: NewAppointment): AppointmentAction => ({
  type: constants.CREATE,
  payload,
})

const createSuccess = (payload: Appointment) => ({
  type: constants.CREATE_SUCCESS,
  payload,
})
const createError = (payload: string): AppointmentAction => ({
  type: constants.CREATE_ERROR,
  payload,
})

const accept = (payload: string): AppointmentAction => ({
  type: constants.ACCEPT,
  payload,
})

const acceptSuccess = (payload: Appointment) => ({
  type: constants.ACCEPT_SUCCESS,
  payload,
})

const acceptError = (payload: string): AppointmentAction => ({
  type: constants.ACCEPT_ERROR,
  payload,
})

const cancel = (payload: string): AppointmentAction => ({
  type: constants.CANCEL,
  payload,
})

const cancelSuccess = (payload: Appointment) => ({
  type: constants.CANCEL_SUCCESS,
  payload,
})

const cancelError = (payload: string): AppointmentAction => ({
  type: constants.CANCEL_ERROR,
  payload,
})

const change = (payload: EditAppointment): AppointmentAction => ({
  type: constants.CHANGE,
  payload,
})

const changeSuccess = (payload: Appointment) => ({
  type: constants.CHANGE_SUCCESS,
  payload,
})

const changeError = (payload: string): AppointmentAction => ({
  type: constants.CHANGE_ERROR,
  payload,
})
export default {
  get,
  getSuccess,
  getError,
  update,
  create,
  createSuccess,
  createError,
  accept,
  acceptSuccess,
  acceptError,
  cancel,
  cancelSuccess,
  cancelError,
  change,
  changeSuccess,
  changeError,
}
