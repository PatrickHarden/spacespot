import { SpacespotState } from '../../global/types'
import selectors from '../selectors'
import {
  NegotiationState,
  NegotiationTermFields,
  NegotiationAPIResponse,
  DepositType,
  PaymentType,
} from '../types'
import negotiation1 from '../__mocks__/negotiation1.json'
import termFields from '../__mocks__/termFields.json'

describe('Negotiation selectors', () => {
  const errorState: SpacespotState = {
    negotiation: { data: {}, loading: false } as NegotiationState,
  }

  const convertJson = (data: any): NegotiationAPIResponse => ({
    ...data,
  })
  const stateNegotiation1: SpacespotState = {
    negotiation: {
      data: convertJson(negotiation1) as NegotiationAPIResponse,
      termsFields: (convertJson(
        termFields,
      ) as unknown) as NegotiationTermFields,
      loading: false,
    } as NegotiationState,
  }

  it('selector should return selected negotiation', () => {
    expect(selectors.getNegotiationTerms(stateNegotiation1)).toMatchSnapshot()
  })
  it('selector should return one without data', () => {
    const defaultTerms = {}
    expect(selectors.getNegotiationTerms(errorState)).toEqual(defaultTerms)
  })
  it('selector should return negotiationId', () => {
    expect(selectors.getNegotiationId(stateNegotiation1)).toEqual(129)
  })
  it('selector should return the terms fields', () => {
    expect(selectors.getNegotiationFields(stateNegotiation1)).toMatchSnapshot()
  })
})
