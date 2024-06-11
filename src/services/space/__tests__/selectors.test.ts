import { SpacespotState } from '../../global/types'
import { SpaceGetResponse, SpaceSearchResponse, Space } from '../types'
import selectors from '../selectors'
import GBPlus473580 from '../__mocks__/GB-Plus-473580.json'
import GBPlus473580Errors from '../__mocks__/GB-Plus-473580-errors.json'
import DashboardBuildingSpace from '../__mocks__/dashboard-building-space.json'
import Space1 from '../__mocks__/space1.json'
import { DashboardState } from 'services/dashboard/types'
import { AmenityOptions } from 'services/onboarding/types'

describe('Space selectors', () => {
  const itemState: SpacespotState = {
    space: { item: {} as SpaceGetResponse },
  }
  const searchState: SpacespotState = {
    space: { search: {} as SpaceSearchResponse },
  }
  const convertJsonToSpace = (space: any): SpaceGetResponse => ({
    ...space,
  })
  const itemStateGBPlus473580: SpacespotState = {
    space: { item: convertJsonToSpace(GBPlus473580) as SpaceGetResponse },
  }
  const itemStateGBPlus473580Errors: SpacespotState = {
    space: { item: convertJsonToSpace(GBPlus473580Errors) as SpaceGetResponse },
  }
  const itemDashboardBuildingSpace: SpacespotState = {
    ...((DashboardBuildingSpace as unknown) as SpacespotState),
  }
  const spaceDocument1: Space = {
    ...((Space1 as unknown) as Space),
  }
  it('selector should return selected space', () => {
    expect(selectors.selectSpaceItem(itemState)).toEqual({})
  })

  it('selector should return search results', () => {
    expect(selectors.selectSearch(searchState)).toEqual({})
  })

  it('selector should return same object', () => {
    expect(selectors.selectSpaceItem(itemStateGBPlus473580)).toEqual(
      GBPlus473580,
    )
  })

  it('selector should return no errors', () => {
    expect(selectors.selectSpaceError(itemStateGBPlus473580Errors)).toEqual(
      undefined,
    )
  })

  it('selector should return no errors', () => {
    expect(
      selectors.selectSpaceError({ space: { item: { error: 'test' } } }),
    ).toEqual('test')
  })
  it('selector get translated space from building', () => {
    expect(
      selectors.translateSpace(
        ((itemDashboardBuildingSpace.dashboard as unknown) as DashboardState)
          .buildings[0] as Space,
      ),
    ).toMatchSnapshot()
  })
  it('selector get translated space from space', () => {
    expect(
      selectors.translateSpace(
        ((itemDashboardBuildingSpace.dashboard as unknown) as DashboardState)
          .spaces['SS_BUILDING_325'][0] as Space,
      ),
    ).toMatchSnapshot()
  })
  it('selector get amenities from state', () => {
    const amenities = {} as AmenityOptions
    expect(
      selectors.regionAmenities({ space: { regionAmenities: amenities } }),
    ).toEqual(amenities)
  })
  it('selector get seletedSpace', () => {
    const space = {} as Space
    expect(
      selectors.selectedSpace({
        space: {
          selectedSpace: { Found: true, ElapsedTime: 'test', Document: space },
        },
      }),
    ).toEqual(space)
  })
  it('selector get amenities from state', () => {
    const space = {} as Space
    expect(
      selectors.parentSpace({
        space: {
          parentSpace: { Found: true, ElapsedTime: 'test', Document: space },
        },
      }),
    ).toEqual(space)
  })
  it('selector translate Space', () => {
    expect(selectors.translateSpace(spaceDocument1)).toMatchSnapshot()
  })
  it('selector getAvailability', () => {
    expect(selectors.getAvailability(spaceDocument1)).toMatchSnapshot()
  })
})
