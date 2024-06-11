import { get } from 'lodash'
import { Space } from '../types'
import {
  generateGallery,
  getCharges,
  getImages,
  getFloorPlans,
} from '../helpers'

import Space1 from '../__mocks__/space1.json'
import dashboardBuilding from '../__mocks__/dashboard-building-space.json'
import { DashboardState } from 'services/dashboard/types'
import { SpacespotState } from 'services/global/types'

describe('Space helpers', () => {
  const spaceDocument1: Space = {
    ...((Space1 as unknown) as Space),
  }
  const dashboardBuildingDocument: SpacespotState = {
    ...((dashboardBuilding as unknown) as SpacespotState),
  }

  it('selector should return floorplans', () => {
    expect(getFloorPlans(spaceDocument1)).toMatchSnapshot()
  })
  it('selector should return getImages', () => {
    expect(getImages(spaceDocument1)).toMatchSnapshot()
  })
  it('selector should return getCharges of space Document1', () => {
    expect(getCharges(spaceDocument1)).toMatchSnapshot()
  })
  it('selector should return getCharges of dashboard building', () => {
    expect(
      getCharges(
        ((dashboardBuildingDocument.dashboard as unknown) as DashboardState)
          .spaces['SS_BUILDING_325'][0] as Space,
      ),
    ).toMatchSnapshot()
  })
  it('selector should return getCharges of space Document1', () => {
    expect(
      generateGallery(get(spaceDocument1, '["Common.Photos"][0]')),
    ).toMatchSnapshot()
  })
})
