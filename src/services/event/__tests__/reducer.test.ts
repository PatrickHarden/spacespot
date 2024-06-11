import reducer from '../reducer'
import actions from '../actions'
import { EnquiryEventAction } from '../types'

describe('Events reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, { payload: { enquiryId: '1' } } as EnquiryEventAction),
    ).toEqual({})
  })

  it('init should update state', () => {
    const id = '1'
    const resp = { [id]: { events: [], isLoading: true } }
    expect(reducer(undefined, actions.get(id))).toEqual(resp)
  })

  it('error should update state', () => {
    const id = '1'
    const err = { [id]: { events: [], isLoading: false, error: 'Error1' } }
    expect(reducer(undefined, actions.getError(id, 'Error1'))).toEqual(err)
  })

  it('get success should update state', () => {
    const id = '1'
    const resp = { [id]: { events: [], isLoading: false } }
    expect(reducer(undefined, actions.getSuccess(id, []))).toEqual(resp)
  })
})
