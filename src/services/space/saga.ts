import { put, takeLatest, takeEvery, call, select } from 'redux-saga/effects'
import { get } from 'lodash'
import constants from './constants'
import actions from './actions'
import { getCountry } from './selectors'
import { getSpace, filterSpaces } from './api'
import { getAmenities, AmenityData } from 'services/config/api'
import {
  SpaceAction,
  FilterOptions,
  Space,
  SpaceSearchResponse,
  SpaceGetResponse,
} from './types'
import enquirySelectors from '../enquiry/selectors'
import { AmenityOptions } from 'services/onboarding/types'
import { getUserLanguage } from 'intl'

const getDocument = (result: SpaceSearchResponse): Space =>
  get(result, 'Document', {}) as Space

export function* searchSpacesSaga(action: SpaceAction) {
  try {
    const options = action.payload as FilterOptions
    const result = yield call(filterSpaces, options)
    yield put(actions.searchSuccess(result))
  } catch (e) {
    yield put(actions.searchError(e.message))
  }
}

export function* getEnquirySpaceSaga() {
  try {
    const idSpace = yield select(enquirySelectors.getSpaceId)
    const result = yield call(getSpace, idSpace)
    yield put(actions.getSuccess(result))
  } catch (e) {
    yield put(actions.getError(e.message))
  }
}

export function* getSpaceSaga(action: SpaceAction) {
  try {
    const idSpace = action.payload as string
    const result = yield call(getSpace, idSpace)
    yield put(actions.getSpaceSuccess(getDocument(result)))
  } catch (e) {
    yield put(actions.getSpaceError(e.message))
  }
}
export function* getSelectedSpaceSaga(action: SpaceAction) {
  try {
    const idSpace = action.payload as string
    const result: SpaceGetResponse = yield call(getSpace, idSpace)
    yield put(actions.getSelectedSpaceSuccess(result))
    const parentId = result.Document['Common.ParentProperty']
    if (parentId) {
      const parent: SpaceGetResponse = yield call(getSpace, parentId)
      yield put(actions.getParentSpaceSuccess(parent))
      const lang = getUserLanguage()
      const region = getCountry(parent.Document)
      const resp: Array<AmenityData> = yield call(getAmenities, region, lang)
      const amenityOptions = resp.reduce((obj: AmenityOptions, item) => {
        obj[item.name] = { desc: item.description, checked: false }
        return obj
      }, {})
      yield put(actions.getAmenitiesSuccess(amenityOptions))
    }
  } catch (e) {
    yield put(actions.getSelectedSpaceError(e.message))
  }
}

function* saga() {
  yield takeLatest(constants.SEARCH_INIT, searchSpacesSaga)
  yield takeLatest(constants.GET_INIT, getEnquirySpaceSaga)
  yield takeEvery(constants.GET_SPACE, getSpaceSaga)
  yield takeLatest(constants.GET_SELECTED_SPACE, getSelectedSpaceSaga)
}

export default saga
