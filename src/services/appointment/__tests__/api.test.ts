import axios from 'axios'
import { Appointment, NewAppointment } from '../types'
import {
  getAppointments,
  createAppointment,
  acceptAppointment,
  cancelAppointment,
  changeAppointment,
} from '../api'

jest.mock('axios')

const mockedResponse = [] as Array<Appointment>
const getMock = () => {
  return Promise.resolve({
    data: mockedResponse,
  })
}

describe('Appointment API', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Appointments get', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockImplementation(getMock)
    const enquiryId = '1'
    const token = 'Fake token'
    const response = await getAppointments(enquiryId, token)
    expect(response).toEqual(mockedResponse)
  })

  it('Appointment create', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(getMock)
    const enquiryId = '1'
    const token = 'Fake token'
    const newAppointment: NewAppointment = {
      description: 'description',
      proposedTime: '08:00',
    }
    const response = await createAppointment(enquiryId, newAppointment, token)
    expect(response).toEqual(mockedResponse)
  })

  it('Appointment accept', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(getMock)
    const appointmentId = '1'
    const token = 'Fake token'
    const response = await acceptAppointment(appointmentId, token)
    expect(response).toEqual(mockedResponse)
  })

  it('Appointment cancel', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(getMock)
    const appointmentId = '1'
    const token = 'Fake token'
    const response = await cancelAppointment(appointmentId, token)
    expect(response).toEqual(mockedResponse)
  })
  it('Appointment change', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockImplementation(getMock)
    const appointment = {
      id: 'test',
      proposedTime: 'test',
      description: 'test',
    }
    const token = 'Fake token'
    const response = await changeAppointment(appointment, token)
    expect(response).toEqual(mockedResponse)
  })
})
