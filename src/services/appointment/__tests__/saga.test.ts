import { runSaga, Saga } from 'redux-saga'
import { put, call, select } from 'redux-saga/effects'
import {
  getAppointmentsSaga,
  newAppointmentSaga,
  acceptAppointmentSaga,
  cancelAppointmentSaga,
  changeAppointmentSaga,
} from '../saga'
import actions from '../actions'
import { AppointmentAction, Appointment } from '../types'
import {
  getAppointments,
  createAppointment,
  acceptAppointment,
  cancelAppointment,
  changeAppointment,
} from '../api'
import userSelectors from 'services/user/selectors'

jest.mock('../api')

async function recordSaga(saga: Saga, initialAction: AppointmentAction) {
  const dispatched: Array<unknown> = []
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
      getState: () => ({
        user: {
          auth: {},
          token: 'testing',
        },
      }),
    },
    saga,
    initialAction,
  ).toPromise()
  return dispatched
}

describe('Appointment sagas', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('get saga should call get API', async () => {
    const mockedResponse = {} as Array<Appointment>
    const getAppointmentsMock = getAppointments as jest.Mock
    getAppointmentsMock.mockImplementation(() => {
      return mockedResponse
    })
    const dispatched = await recordSaga(
      getAppointmentsSaga as Saga,
      actions.get(),
    )
    expect(getAppointments).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getSuccess(mockedResponse))
  })

  it('get saga should call get API and return error', async () => {
    const getChatMock = getAppointments as jest.Mock
    getChatMock.mockImplementation(() => {
      throw Error('Error')
    })
    const dispatched = await recordSaga(
      getAppointmentsSaga as Saga,
      actions.get(),
    )
    expect(getAppointments).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getError('Error'))
  })

  it('create saga should call API', async () => {
    const mockedResponse = {} as Array<Appointment>
    const createAppointmentMock = createAppointment as jest.Mock
    createAppointmentMock.mockImplementation(() => {
      return mockedResponse
    })
    const dispatched = await recordSaga(
      newAppointmentSaga as Saga,
      actions.create({ description: 'desct', proposedTime: '08:00' }),
    )
    expect(createAppointment).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.createSuccess({} as Appointment))
  })

  it('create saga should fail', async () => {
    const createAppointmentMock = createAppointment as jest.Mock
    createAppointmentMock.mockImplementation(() => {
      throw Error('Error')
    })
    const dispatched = await recordSaga(
      newAppointmentSaga as Saga,
      actions.create({ description: 'desct', proposedTime: '08:00' }),
    )
    expect(createAppointment).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.createError('Error'))
  })

  it('accept appointment saga', async () => {
    const appointmentId = '1'
    const token = 'dummy'
    const appointment1 = {} as Appointment
    const gen = acceptAppointmentSaga(
      actions.accept(appointmentId),
    ) as Generator<void, any, any>
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(acceptAppointment, appointmentId, token),
    )
    expect(gen.next({}).value).toEqual(put(actions.acceptSuccess(appointment1)))
    expect(gen.next().value).toEqual(put(actions.get()))
  })

  it('accept appointment saga (fail)', async () => {
    const appointmentId = '1'
    const token = 'dummy'
    const gen = acceptAppointmentSaga(
      actions.accept(appointmentId),
    ) as Generator<void, any, any>
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(acceptAppointment, appointmentId, token),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.acceptError('Error1')),
    )
  })

  it('cancel appointment saga', async () => {
    const appointmentId = '1'
    const token = 'dummy'
    const appointment1 = {} as Appointment
    const gen = cancelAppointmentSaga(
      actions.cancel(appointmentId),
    ) as Generator<void, any, any>
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(cancelAppointment, appointmentId, token),
    )
    expect(gen.next({}).value).toEqual(put(actions.cancelSuccess(appointment1)))
    expect(gen.next().value).toEqual(put(actions.get()))
  })

  it('cancel appointment saga (fail)', async () => {
    const appointmentId = '1'
    const token = 'dummy'
    const gen = cancelAppointmentSaga(
      actions.cancel(appointmentId),
    ) as Generator<void, any, any>
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(cancelAppointment, appointmentId, token),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.cancelError('Error1')),
    )
  })
  it('change appointment saga', async () => {
    const appointment = {
      id: '1',
      proposedTime: 'date',
      description: 'test',
    }
    const token = 'dummy'
    const appointment1 = {} as Appointment
    const gen = changeAppointmentSaga(actions.change(appointment)) as Generator<
      void,
      any,
      any
    >
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(changeAppointment, appointment, token),
    )
    expect(gen.next({}).value).toEqual(put(actions.changeSuccess(appointment1)))
    expect(gen.next().value).toEqual(put(actions.get()))
  })
  it('change appointment saga (fail)', async () => {
    const appointment = {
      id: '1',
      proposedTime: 'date',
      description: 'test',
    }
    const token = 'dummy'
    const gen = changeAppointmentSaga(actions.change(appointment)) as Generator<
      void,
      any,
      any
    >
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(changeAppointment, appointment, token),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.changeError('Error1')),
    )
  })
})
