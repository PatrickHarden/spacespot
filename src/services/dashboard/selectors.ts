import { get, chain } from 'lodash'
import { SpacespotState } from 'services/global/types'

import { Space, TranslatePropSpace } from 'services/space/types'
import selectors from 'services/space/selectors'

import { DashboardState } from './types'

const spacesBuildings = (spaces: Array<Space>): Array<TranslatePropSpace> =>
  spaces
    ? spaces
        .map((space: Space) => selectors.translateBuilding(space, true))
        .sort((spaceA, spaceB) => (spaceA.name > spaceB.name ? 1 : -1))
    : []

const selectDashboard = (state: SpacespotState) => get(state, 'dashboard')

const selectDashboardBuildings = (state: SpacespotState) => {
  const spaces = get(selectDashboard(state), 'buildings', [])
  return spacesBuildings(spaces)
}

const selectDashboardSpaceCurried = (state: SpacespotState) => (id: string) =>
  chain(selectDashboard(state))
    .get('spaces')
    .map((building: Array<Space>) =>
      building.filter((space: Space) => get(space, 'Common.PrimaryKey') === id),
    )
    .filter((building: Array<Space>) => building.length > 0)
    .head()
    .head()
    .value()

const selectDashboardBuildingCurried = (state: SpacespotState) => (
  id: string,
) =>
  chain(selectDashboard(state) as DashboardState)
    .get('buildings')
    .filter((build: Space) => get(build, 'Common.PrimaryKey') === id)
    .head()
    .value()

const selectDashboardSpaces = (state: SpacespotState) => {
  const spaces = get(selectDashboard(state), 'spaces')
  if (!spaces) {
    return {}
  }
  return Object.keys(spaces).reduce(
    (
      accumulator: { [key: string]: Array<TranslatePropSpace> },
      id: string,
    ) => ({
      ...accumulator,
      [id]: spacesBuildings(spaces[id] as Array<Space>),
    }),
    {},
  )
}

const isDashboardLoading = (state: SpacespotState): boolean => {
  return get(state, 'dashboard.isLoading', false)
}

const isDashboardInitOK = (state: SpacespotState): boolean => {
  return get(state, 'dashboard.initOK', false)
}

const pendingDelete = (state: SpacespotState): Array<string> => {
  return get(state, 'dashboard.pendingDelete', [])
}

export default {
  selectDashboardBuildings,
  selectDashboardBuildingCurried,
  selectDashboardSpaceCurried,
  selectDashboardSpaces,
  isDashboardLoading,
  isDashboardInitOK,
  pendingDelete,
}
