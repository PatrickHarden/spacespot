import axios, { AxiosResponse } from 'axios'
import CONFIG from 'config'
import { Appointment, EditAppointment, NewAppointment } from './types'

export const getAppointments = async (
  enquireId: string,
  token: string,
): Promise<Array<Appointment>> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquireId}/appointments`
  const config = { headers: { Authorization: `Bearer ${token}` } }

  const resp: AxiosResponse<Array<Appointment>> = await axios.get(url, config)
  return resp.data
}
const getTimeZone = () => {
  const offset = new Date().getTimezoneOffset(),
    o = Math.abs(offset)
  return (
    'GMT' +
    (offset < 0 ? '+' : '-') +
    ('00' + Math.floor(o / 60)).slice(-2) +
    ':' +
    ('00' + (o % 60)).slice(-2)
  )
}
export const createAppointment = async (
  enquireId: string,
  newAppointment: NewAppointment,
  token: string,
): Promise<Appointment> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquireId}/appointments`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const data = {
    description: newAppointment.description,
    timeZone: getTimeZone(),
    proposedTime: newAppointment.proposedTime,
  }
  const resp: AxiosResponse<Appointment> = await axios.post(url, data, config)
  return resp.data
}

export const acceptAppointment = async (
  appointmentId: string,
  token: string,
): Promise<Appointment> => {
  const url = `${CONFIG.API_HOST}/appointments/${appointmentId}/accept`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<Appointment> = await axios.post(url, null, config)
  return resp.data
}

export const cancelAppointment = async (
  appointmentId: string,
  token: string,
): Promise<Appointment> => {
  const url = `${CONFIG.API_HOST}/appointments/${appointmentId}/cancel`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<Appointment> = await axios.post(url, null, config)
  return resp.data
}
export const changeAppointment = async (
  appointment: EditAppointment,
  token: string,
): Promise<Appointment> => {
  const url = `${CONFIG.API_HOST}/appointments/${appointment.id}`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<Appointment> = await axios.post(
    url,
    {
      ...appointment,
      timeZone: getTimeZone(),
    },
    config,
  )
  return resp.data
}
