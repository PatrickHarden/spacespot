import reducer from '../reducer'
import actions from '../actions'
import { AppointmentAction, AppointmentState, Appointment } from '../types'

describe('Appointment reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as AppointmentAction)).toEqual({})
  })
  it('get success should update state', () => {
    const state: AppointmentState = {} as AppointmentState
    expect(reducer(undefined, actions.get())).toEqual(state)
  })

  it('search error should update state', () => {
    const err = { error: 'Error1' }
    expect(reducer(undefined, actions.getError('Error1'))).toEqual(err)
  })

  it('get success should update state', () => {
    const resp: Array<Appointment> = [] as Array<Appointment>
    expect(reducer(undefined, actions.getSuccess(resp))).toEqual({
      data: resp,
    })
  })
  it('create success should update state', () => {
    const data: Array<Appointment> = [{}] as Array<Appointment>
    expect(
      reducer(undefined, actions.createSuccess({} as Appointment)),
    ).toEqual({
      data,
    })
  })
})
