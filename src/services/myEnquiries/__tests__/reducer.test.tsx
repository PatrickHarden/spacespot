import reducer from '../reducer'
import actions from '../actions'
import { MyEnquiriesAPIResponse, MyEnquiriesState } from '../types'

import data1 from '../__mocks__/user-enquiries.json'

describe('MyEnquiries reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      data: undefined,
      loading: false,
    })
  })
  it('init should update state', () => {
    const resp = { loading: true }
    expect(reducer(undefined, actions.get())).toEqual(resp)
  })

  it('error should update state', () => {
    const err = { error: 'Error1' }
    expect(reducer(undefined, actions.getError('Error1'))).toEqual({
      ...err,
      loading: false,
    })
  })

  it('get success should update state', () => {
    const resp = {} as MyEnquiriesAPIResponse
    expect(reducer(undefined, actions.getSuccess(resp))).toEqual({
      data: resp,
      loading: false,
    })
  })

  it('get accept and reject success should update state', () => {
    const stateMyEnquiries1: MyEnquiriesState = {
      data: data1 as Array<MyEnquiriesAPIResponse>,
      loading: false,
    }
    const respAccept = {
      enquireId: 167,
      negotiationId: 2,
    } as MyEnquiriesAPIResponse
    expect(
      reducer(stateMyEnquiries1, actions.acceptSuccess(respAccept)),
    ).toMatchSnapshot()
    const respReject = {
      enquireId: 168,
      negotiationId: 2,
    } as MyEnquiriesAPIResponse
    expect(
      reducer(stateMyEnquiries1, actions.rejectSuccess(respReject)),
    ).toMatchSnapshot()
  })
})
