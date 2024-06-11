import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import { get } from 'lodash'
import constants from './constants'
import actions from './actions'
import { searchSpaces } from 'services/space/api'
import { Space, SpaceSearchResponse, SearchOptions } from 'services/space/types'
import userSelectors from '../user/selectors'
import { getUserLocale } from 'intl'

const getDocuments = (result: SpaceSearchResponse): Array<Space> =>
  get(result, 'Documents[0]')

export const getBuildingSpaces = (
  resultSpaces: SpaceSearchResponse,
): { [key: string]: Array<Space> } => {
  return resultSpaces.Documents[0].reduce(
    (accumulator: { [key: string]: Array<Space> }, newitem: Space) => {
      const item: Array<Space> = []
      item.push(newitem)
      if (!item || !item[0]) {
        return accumulator
      }
      const getItem = get(item[0], 'Common.ParentProperty', '')

      const buildingID = Object.keys(accumulator).filter(
        building => building === getItem,
      )
      if (buildingID.length) {
        accumulator[buildingID[0]].push(item[0])
        return accumulator
      }
      return {
        ...accumulator,
        [getItem]: item,
      }
    },
    {},
  )
}

export function* getDashboardSaga() {
  try {
    const userId = yield select(userSelectors.accountIdentifier)
    const options = {
      region: '',
      locale: getUserLocale(),
      landLord: userId,
      isParent: true,
    } as SearchOptions
    const resultBuildings: SpaceSearchResponse = yield call(
      searchSpaces,
      options,
    )
    const resultBuildingsDoc: Array<Space> = getDocuments(resultBuildings)
    // Spaces
    const primaryKey: any = []
    resultBuildingsDoc.map((item: Space) => {
      primaryKey.push(item['Common.PrimaryKey'])
    })
    const spaceOptions = {
      region: '',
      locale: getUserLocale(),
      landLord: userId,
      parentProperty: primaryKey.join(),
    }
    const resultSpaces: SpaceSearchResponse = yield call(
      searchSpaces,
      spaceOptions,
    )

    yield put(
      actions.dashboardSuccess({
        buildings: resultBuildingsDoc,
        spaces: getBuildingSpaces(resultSpaces),
      }),
    )
  } catch (e) {
    yield put(actions.dashboardError(e.message))
  }
}
function* saga() {
  yield takeLatest(constants.DASHBOARD_INIT, getDashboardSaga)
}

export default saga
