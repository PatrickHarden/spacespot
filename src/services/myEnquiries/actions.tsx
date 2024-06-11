import { MyEnquiriesAPIResponse } from './types'
import constants from './constants'

const get = () => ({
  type: constants.GET,
})

const getSuccess = (payload: Array<MyEnquiriesAPIResponse>) => ({
  type: constants.GET_SUCCESS,
  payload,
})

const getError = (payload: string) => ({
  type: constants.GET_ERROR,
  payload,
})
const accept = (payload: string) => ({
  type: constants.ACCEPT,
  payload,
})

const acceptSuccess = (payload: MyEnquiriesAPIResponse) => ({
  type: constants.ACCEPT_SUCCESS,
  payload,
})

const acceptError = (payload: string) => ({
  type: constants.ACCEPT_ERROR,
  payload,
})
const reject = (payload: string) => ({
  type: constants.REJECT,
  payload,
})

const rejectSuccess = (payload: MyEnquiriesAPIResponse) => ({
  type: constants.REJECT_SUCCESS,
  payload,
})

const rejectError = (payload: string) => ({
  type: constants.REJECT_ERROR,
  payload,
})

const cancel = (payload: { enquiryId: string; feedback?: string }) => ({
  type: constants.CANCEL,
  payload,
})

const cancelSuccess = (payload: MyEnquiriesAPIResponse) => ({
  type: constants.CANCEL_SUCCESS,
  payload,
})

const cancelError = (payload: string) => ({
  type: constants.CANCEL_ERROR,
  payload,
})

const setNotifications = (payload: number) => ({
  type: constants.SET_NOTIFICATIONS,
  payload,
})

const getNotifications = () => ({
  type: constants.GET_NOTIFICATIONS,
})

export default {
  get,
  getSuccess,
  getError,
  accept,
  acceptSuccess,
  acceptError,
  reject,
  rejectSuccess,
  rejectError,
  cancel,
  cancelSuccess,
  cancelError,
  setNotifications,
  getNotifications,
}
