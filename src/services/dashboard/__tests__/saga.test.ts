import { select, all, call, put } from 'redux-saga/effects'
import { getDashboardSaga, getBuildingSpaces } from '../saga'
import { searchSpaces } from 'services/space/api'
import userSelectors from 'services/user/selectors'
import { Space, SearchOptions, SpaceSearchResponse } from 'services/space/types'
import actions from '../actions'

describe('Dashboard sagas', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('dashboard saga', async () => {
    const account = '1234'
    const options = {
      region: '',
      locale: 'en-US',
      landLord: account,
      isParent: true,
    } as SearchOptions
    const sresponse: SpaceSearchResponse = {
      Documents: [[{}]],
    } as SpaceSearchResponse
    const buildingsResponse = sresponse
    const resultBuildingsDoc = buildingsResponse.Documents[0]

    const resultSpaces: Array<SpaceSearchResponse> = [sresponse]
    const gen = getDashboardSaga() as Generator<void, any, any>
    expect(gen.next().value).toEqual(select(userSelectors.accountIdentifier))
    expect(gen.next(account).value).toEqual(call(searchSpaces, options))
    expect(gen.next(buildingsResponse).value).toEqual(
      all(
        resultBuildingsDoc.map((item: Space) =>
          call(searchSpaces, {
            region: '',
            locale: 'en-US',
            landLord: account,
            parentProperty: item['Common.PrimaryKey'],
          }),
        ),
      ),
    )
    expect(gen.next(resultSpaces).value).toEqual(
      put(
        actions.dashboardSuccess({
          buildings: resultBuildingsDoc,
          spaces: getBuildingSpaces(resultSpaces),
        }),
      ),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('dashboard saga error', async () => {
    const gen = getDashboardSaga() as Generator<void, any, any>
    expect(gen.next().value).toEqual(select(userSelectors.accountIdentifier))
    gen.throw(new Error('Error1'))
  })
})
