import reducer from '../reducer'
import actions from '../actions'
import {
  NegotiationAPIResponse,
  FitoutOptionProps,
  NegotiationStatusResponse,
} from '../types'

describe('Negotiation reducer', () => {
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
    const resp = {} as NegotiationAPIResponse
    expect(reducer(undefined, actions.getSuccess(resp))).toEqual({
      data: resp,
      loading: false,
    })
  })

  it('getFields success should update state', () => {
    const resp = {}
    expect(reducer(undefined, actions.getFieldsSuccess(resp))).toEqual({
      termsFields: resp,
      loading: false,
    })
  })

  it('custom fituot options get success should update state', () => {
    const resp: Array<FitoutOptionProps> = [
      { id: '1', isCustom: true, name: 'test', description: 'test', amount: 1 },
    ]
    expect(reducer(undefined, actions.getCustomFitoutSuccess(resp))).toEqual({
      customFitout: resp,
      loading: false,
    })
  })

  it('custom fituot options put custom fitout success should update state', () => {
    const state = {
      customFitout: [
        {
          id: '1',
          isCustom: true,
          name: 'test',
          description: 'test',
          amount: 1,
        },
      ],
      loading: false,
    }
    const resp: FitoutOptionProps = {
      id: '2',
      isCustom: true,
      name: 'test2',
      description: 'test2',
      amount: 2,
    }

    expect(
      reducer(state, actions.putCustomFitoutSuccess(resp)),
    ).toMatchSnapshot()
  })
  it('custom fituot options delete custom fitout success should update state', () => {
    const state = {
      customFitout: [
        {
          id: '1',
          isCustom: true,
          name: 'test',
          description: 'test',
          amount: 1,
        },
        {
          id: '2',
          isCustom: true,
          name: 'test2',
          description: 'test2',
          amount: 2,
        },
      ],
      loading: false,
    }
    const resp = '2'

    expect(reducer(state, actions.deleteFitoutSuccess(resp))).toMatchSnapshot()
  })
  it('custom fituot options select fitout success should update state', () => {
    const resp = {} as NegotiationAPIResponse
    expect(reducer(undefined, actions.selectFitoutSuccess(resp))).toEqual({
      data: resp,
      loading: false,
    })
  })
  it('negotiation status success should update state', () => {
    const resp = {
      negotiationId: 165,
      peer1SignLeaseStatus: 'TermsAgreed',
      peer2SignLeaseStatus: 'TermsAgreed',
    } as NegotiationStatusResponse
    expect(
      reducer(undefined, actions.putNegotiationStatusSuccess(resp)),
    ).toEqual({
      data: resp,
      loading: false,
    })
  })
})
