import { put, call, takeLatest, select } from 'redux-saga/effects'

import constants from './constants'
import actions from './actions'
import {
  Appointment,
  AppointmentAction,
  EditAppointment,
  NewAppointment,
} from './types'
import {
  getAppointments,
  createAppointment,
  acceptAppointment,
  cancelAppointment,
  changeAppointment,
} from './api'
import enquirySelectors from 'services/enquiry/selectors'
import userSelectors from 'services/user/selectors'

export function* getAppointmentsSaga() {
  try {
    const enquiryId = yield select(enquirySelectors.getEnquiryId)
    const token: string = yield select(userSelectors.token)
    const chat: Array<Appointment> = yield call(
      getAppointments,
      enquiryId,
      token,
    )
    yield put(actions.getSuccess(chat))
  } catch (e) {
    yield put(actions.getError(e.message))
  }
}

export function* newAppointmentSaga(action: AppointmentAction) {
  try {
    const enquiryId = yield select(enquirySelectors.getEnquiryId)
    const token: string = yield select(userSelectors.token)
    const appointment = yield call(
      createAppointment,
      enquiryId,
      action.payload as NewAppointment,
      token,
    )
    yield put(actions.createSuccess(appointment))
    // FIXME remove this if the appointment is complete
    yield put(actions.get())
  } catch (e) {
    yield put(actions.createError(e.message))
  }
}

export function* acceptAppointmentSaga(action: AppointmentAction) {
  try {
    const token: string = yield select(userSelectors.token)
    const appointmentId = action.payload as string
    const appointment = yield call(acceptAppointment, appointmentId, token)
    yield put(actions.acceptSuccess(appointment))
    yield put(actions.get())
  } catch (e) {
    yield put(actions.acceptError(e.message))
  }
}

export function* cancelAppointmentSaga(action: AppointmentAction) {
  try {
    const token: string = yield select(userSelectors.token)
    const appointmentId = action.payload as string
    const appointment = yield call(cancelAppointment, appointmentId, token)
    yield put(actions.cancelSuccess(appointment))
    yield put(actions.get())
  } catch (e) {
    yield put(actions.cancelError(e.message))
  }
}
export function* changeAppointmentSaga(action: AppointmentAction) {
  try {
    const token: string = yield select(userSelectors.token)
    const appointment = action.payload as EditAppointment
    const appointmentResponse = yield call(
      changeAppointment,
      appointment,
      token,
    )
    yield put(actions.changeSuccess(appointmentResponse))
    yield put(actions.get())
  } catch (e) {
    yield put(actions.changeError(e.message))
  }
}
function* saga() {
  yield takeLatest(constants.GET, getAppointmentsSaga)
  yield takeLatest(constants.UPDATE, getAppointmentsSaga)
  yield takeLatest(constants.CREATE, newAppointmentSaga)
  yield takeLatest(constants.ACCEPT, acceptAppointmentSaga)
  yield takeLatest(constants.CANCEL, cancelAppointmentSaga)
  yield takeLatest(constants.CHANGE, changeAppointmentSaga)
}

export default saga
