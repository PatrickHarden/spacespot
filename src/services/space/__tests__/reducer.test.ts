import reducer from '../reducer'
import actions from '../actions'
import {
  SpaceAction,
  SpaceGetResponse,
  SpaceSearchResponse,
  Space,
} from '../types'
import { AmenityOptions } from 'services/onboarding/types'

describe('Space reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as SpaceAction)).toEqual({})
  })

  it('search success should update state', () => {
    const resp: SpaceSearchResponse = {} as SpaceSearchResponse
    expect(reducer(undefined, actions.searchSuccess(resp))).toEqual({
      search: resp,
    })
  })
  it('search error should update state', () => {
    const err = { error: 'Error1' }
    expect(reducer(undefined, actions.searchError('Error1'))).toEqual({
      search: err,
    })
  })

  it('get success should update state', () => {
    const resp: SpaceGetResponse = {} as SpaceGetResponse
    expect(reducer(undefined, actions.getSuccess(resp))).toEqual({ item: resp })
  })

  it('get error should update state', () => {
    const err = { error: 'Error1' }
    expect(reducer(undefined, actions.getError('Error1'))).toEqual({
      item: err,
    })
  })
  it('get success state should update state', () => {
    const idSpace = 123
    const resp: Space = ({
      'Common.PrimaryKey': idSpace,
    } as unknown) as Space

    expect(reducer(undefined, actions.getSpaceSuccess(resp))).toEqual({
      items: { [idSpace]: resp },
    })
  })
  it('get selected success state should update state', () => {
    const resp: SpaceGetResponse = {} as SpaceGetResponse
    expect(reducer(undefined, actions.getSelectedSpaceSuccess(resp))).toEqual({
      selectedSpace: resp,
    })
  })
  it('get parent space success state should update state', () => {
    const resp: SpaceGetResponse = {} as SpaceGetResponse
    expect(reducer(undefined, actions.getParentSpaceSuccess(resp))).toEqual({
      parentSpace: resp,
    })
  })
  it('get amenitites success state should update state', () => {
    const resp: AmenityOptions = {} as AmenityOptions
    expect(reducer(undefined, actions.getAmenitiesSuccess(resp))).toEqual({
      regionAmenities: resp,
    })
  })
})
