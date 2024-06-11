import { SpacespotState } from '../../global/types'
import selectors from '../selectors'
import DashboardBuildingSpace from 'services/space/__mocks__/dashboard-building-space.json'

describe('Dashboard selectors', () => {
  const itemDashboardBuildingSpace: SpacespotState = {
    ...((DashboardBuildingSpace as unknown) as SpacespotState),
  }

  it('selector get spaces data', () => {
    expect(
      selectors.selectDashboardSpaces(itemDashboardBuildingSpace),
    ).toMatchSnapshot()
  })
  it('selector get spaces no data', () => {
    expect(selectors.selectDashboardSpaces({})).toEqual({})
  })
  it('selector get buildings data', () => {
    expect(
      selectors.selectDashboardBuildings(itemDashboardBuildingSpace),
    ).toMatchSnapshot()
  })
  it('selector get buildings data', () => {
    expect(
      selectors.selectDashboardSpaceCurried(itemDashboardBuildingSpace)(
        'SS_SPACE_326',
      ),
    ).toMatchSnapshot()
  })
})
