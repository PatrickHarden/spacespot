import { SpacespotState } from '../../global/types'
import { EnquiryScreenStateData } from '../types'
import selectors from '../selectors'

describe('enquiry screen selectors', () => {
  const errorState: SpacespotState = {
    enquiryscreen: { data: {} as EnquiryScreenStateData, error: 'test' },
  }
  const enquiryScreenState: SpacespotState = {
    enquiryscreen: {
      data: {
        id: '1',
      } as EnquiryScreenStateData,
    },
  }

  it('selector should not return selected enquiry screen', () => {
    expect(selectors.getId(errorState)).toEqual(undefined)
  })
  it('selector should return selected enquiry screen', () => {
    expect(selectors.getId(enquiryScreenState)).toEqual('1')
  })
  it('selector should not return selected enquiry screen error', () => {
    expect(selectors.getError(enquiryScreenState)).toEqual(undefined)
  })
  it('selector should return selected enquiry screen error', () => {
    expect(selectors.getError(errorState)).toEqual('test')
  })
})
