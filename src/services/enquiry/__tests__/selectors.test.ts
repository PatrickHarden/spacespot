import { SpacespotState } from '../../global/types'
import { EnquiryResponse } from '../types'
import selectors from '../selectors'
import enquiry1 from '../__mocks__/1.json'

describe('Space selectors', () => {
  const errorState: SpacespotState = {
    enquiry: { data: {} as EnquiryResponse },
  }

  const convertJsonToSpace = (space: any): EnquiryResponse => ({
    ...space,
  })
  const stateEnquiry1: SpacespotState = {
    enquiry: { data: convertJsonToSpace(enquiry1) as EnquiryResponse },
  }

  it('selector should return selected enquiry', () => {
    expect(selectors.getEnquiry(errorState)).toEqual({})
  })

  it('selector should return same enquiry', () => {
    expect(selectors.getEnquiry(stateEnquiry1)).toEqual(enquiry1)
  })
  it('selector should return chatId', () => {
    expect(selectors.getChatId(stateEnquiry1)).toEqual(1)
  })
  it('selector should not return chatId', () => {
    expect(selectors.getChatId(errorState)).toEqual(undefined)
  })

  it('selector should return enquireId', () => {
    expect(selectors.getEnquiryId(stateEnquiry1)).toEqual(1)
  })
  it('selector should not return enquireId', () => {
    expect(selectors.getEnquiryId(errorState)).toEqual(undefined)
  })

  it('selector should return spaceId', () => {
    expect(selectors.getSpaceId(stateEnquiry1)).toEqual(2)
  })
  it('selector should not return spaceId', () => {
    expect(selectors.getChatId(errorState)).toEqual(undefined)
  })
})
