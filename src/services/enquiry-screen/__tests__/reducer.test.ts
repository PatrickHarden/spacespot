import reducer from '../reducer'
import actions from '../actions'
import { EnquiryScreenStateData, EnquiryScreenAction } from '../types'

describe('enquiry screen reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as EnquiryScreenAction)).toEqual({})
  })
  it('get success should update state', () => {
    const resp: EnquiryScreenStateData = {
      id: '1',
    } as EnquiryScreenStateData
    expect(reducer(undefined, actions.get(resp))).toEqual({ data: resp })
  })
  it('get error should update state', () => {
    const resp = 'test error'
    expect(reducer(undefined, actions.getError(resp))).toEqual({ error: resp })
  })
})
