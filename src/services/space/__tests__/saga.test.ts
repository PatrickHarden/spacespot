import { runSaga, Saga } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import {
  searchSpacesSaga,
  getSpaceSaga,
  getEnquirySpaceSaga,
  getSelectedSpaceSaga,
} from '../saga'
import { getCountry } from '../selectors'
import actions from '../actions'
import {
  SpaceAction,
  SpaceSearchResponse,
  SpaceGetResponse,
  FilterOptions,
  Space,
} from '../types'
import { getSpace, filterSpaces } from '../api'
import { getAmenities } from 'services/config/api'

jest.mock('../api')
type AnyGen = Generator<void, any, any>

async function recordSaga(saga: Saga, initialAction: SpaceAction) {
  const dispatched: Array<unknown> = []
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
      getState: () => ({
        enquiry: { data: { spaceId: '1' } },
      }),
    },
    saga,
    initialAction,
  ).toPromise()
  return dispatched
}

describe('Space sagas', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('saga should call get space API', async () => {
    const mockedResponse = {} as SpaceGetResponse
    const getSpaceMock = getSpace as jest.Mock
    getSpaceMock.mockImplementation(() => {
      return mockedResponse
    })
    const dispatched = await recordSaga(
      getEnquirySpaceSaga as Saga,
      actions.getInit(),
    )
    expect(getSpace).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getSuccess(mockedResponse))
  })

  it('get saga should fail', async () => {
    const getSpaceMock = getSpace as jest.Mock
    getSpaceMock.mockImplementation(() => {
      throw Error('Error1')
    })
    const dispatched = await recordSaga(
      getEnquirySpaceSaga as Saga,
      actions.getInit(),
    )
    expect(getSpace).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getError('Error1'))
  })

  it('saga should call search space API', async () => {
    const mockedResponse = {} as SpaceSearchResponse
    const searchSpacesMock = filterSpaces as jest.Mock
    searchSpacesMock.mockImplementation(() => {
      return mockedResponse
    })
    const dispatched = await recordSaga(
      searchSpacesSaga as Saga,
      actions.searchInit({} as FilterOptions),
    )
    expect(filterSpaces).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.searchSuccess(mockedResponse))
  })

  it('search saga should fail', async () => {
    const searchSpacesMock = filterSpaces as jest.Mock
    searchSpacesMock.mockImplementation(() => {
      throw Error('Error1')
    })
    const dispatched = await recordSaga(
      searchSpacesSaga as Saga,
      actions.searchInit({} as FilterOptions),
    )
    expect(filterSpaces).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.searchError('Error1'))
  })
  it('saga should call get space API', async () => {
    const mockedResponse = {} as SpaceGetResponse
    const getSpaceMock = getSpace as jest.Mock
    getSpaceMock.mockImplementation(() => {
      return mockedResponse
    })
    const dispatched = await recordSaga(getSpaceSaga as Saga, actions.getInit())
    expect(getSpace).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getSpaceSuccess({} as Space))
  })

  it('get saga should fail', async () => {
    const getSpaceMock = getSpace as jest.Mock
    getSpaceMock.mockImplementation(() => {
      throw Error('Error1')
    })
    const dispatched = await recordSaga(getSpaceSaga as Saga, actions.getInit())
    expect(getSpace).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getSpaceError('Error1'))
  })
  it('saga should call get selected space API', async () => {
    const idSpace = '1'
    const idSpaceParent = '2'
    const reply: any = { Document: { 'Common.ParentProperty': idSpaceParent } }
    const parent: any = {}
    const amenities: any = [{ name: 'name', description: 'description' }]
    const gen = getSelectedSpaceSaga(
      actions.getSelectedSpace(idSpace),
    ) as AnyGen
    expect(gen.next().value).toEqual(call(getSpace, idSpace))
    expect(gen.next(reply).value).toEqual(
      put(actions.getSelectedSpaceSuccess(reply)),
    )
    expect(gen.next().value).toEqual(call(getSpace, idSpaceParent))

    expect(gen.next(parent).value).toEqual(
      put(actions.getParentSpaceSuccess(parent)),
    )
    const lang = 'en'
    const region = getCountry(parent.Document)
    expect(gen.next().value).toEqual(call(getAmenities, region, lang))

    expect(gen.next(amenities).value).toEqual(
      put(
        actions.getAmenitiesSuccess({
          name: {
            checked: false,
            desc: 'description',
          },
        }),
      ),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('get saga selected space should fail', async () => {
    const getSpaceMock = getSpace as jest.Mock
    const idSpace = '123'
    getSpaceMock.mockImplementation(() => {
      throw Error('Error1')
    })
    const dispatched = await recordSaga(
      getSelectedSpaceSaga as Saga,
      actions.getSelectedSpace(idSpace),
    )
    expect(getSpace).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getSelectedSpaceError('Error1'))
  })
})
