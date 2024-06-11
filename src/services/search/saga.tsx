import { put, takeLatest, call, select, debounce } from 'redux-saga/effects'
import querystring from 'querystring'

import constants from './constants'
import selectors from './selectors'
import actions from './actions'

import { getSearchSpaces } from './api'
import {
  FilterState,
  SearchType,
  FilterWhere,
  SearchAction,
  FilterAction,
  TypeFilter,
} from './types'

import history from 'browserhistory'
import { getLangPrefix } from 'intl'

const getParamsFromFiltersLocation = (where: FilterWhere | undefined) =>
  !where || !where.location || where.location === ''
    ? undefined
    : !where.latLng
    ? { 'Common.Line1': where.location }
    : {
        Lat: where.latLng.lat,
        Lon: where.latLng.lng,
        Sort: 'asc(_distance)',
      }
const getParamsFromFiltersLocationURL = (where?: FilterWhere) =>
  !where || !where.location || where.location === ''
    ? undefined
    : !where.latLng
    ? { location: where.location }
    : {
        location: where.location,
        lat: where.latLng.lat,
        lon: where.latLng.lng,
        Sort: 'asc(_distance)',
      }

const getParamsFromFiltersDesks = (desks: number | undefined) =>
  desks ? { desks } : undefined

const getParamFromFilterTypeURL = (type: SearchType | undefined) =>
  !type || type === SearchType.Both || type === SearchType.None
    ? undefined
    : type === SearchType.Fixed
    ? { type: 'fixed' }
    : { type: 'flex' }

const getParamFromFilterType = (type: SearchType | undefined) =>
  !type || type === SearchType.Both || type === SearchType.None
    ? undefined
    : type === SearchType.Fixed
    ? { 'Common.UsageType': 'Office' }
    : { 'Common.UsageType': 'FlexOffice' }

const getParamsFromFiltersRadius = (radius?: number, where?: FilterWhere) =>
  radius && radius > 0
    ? { radius }
    : !where || !where.location || where.location === '' || !where.latLng
    ? undefined
    : { radius: 50 }

const getParamsFromFiltersRadiusURL = (radius: number | undefined) =>
  radius && radius > 0 ? { radius } : undefined
const getParamFromFilterMoveInBy = (when?: string) =>
  when && when !== '' ? { moveIn: when } : undefined
const getParamFromFilterLength = (length?: number) =>
  length && length > 0 ? { length } : undefined
const getParamFromFilterMaxRent = (maxRent?: number) =>
  maxRent && maxRent > 0 ? { maxRent } : undefined

const getParamsFromFilters = (filters: FilterState) => ({
  // only location radius and type (flex, fixed, both) are changing the GL query
  ...getParamsFromFiltersLocation(filters.where),
  ...getParamsFromFiltersRadius(filters.radius, filters.where),
  ...getParamFromFilterType(filters.type),
})
const getUrlFromFilters = (filters: FilterState) => ({
  ...getParamsFromFiltersLocationURL(filters.where),
  ...getParamsFromFiltersDesks(filters.desks),
  ...getParamsFromFiltersRadiusURL(filters.radius),
  ...getParamFromFilterTypeURL(filters.type),
  ...getParamFromFilterMoveInBy(filters.when),
  ...getParamFromFilterLength(filters.length),
  ...getParamFromFilterMaxRent(filters.maxRent),
})
export function* searchSpacesSaga(action: SearchAction) {
  try {
    const { payload, type } = action
    const filters: FilterState = yield select(selectors.searchFilters)
    const prefix = getLangPrefix()
    if (
      type === constants.SEARCH_INIT ||
      history.location.pathname.endsWith('/list')
    ) {
      const url = getUrlFromFilters(filters)
      history.push(`${prefix}/list?${querystring.stringify(url)}`)
    }
    if (
      type === constants.SEARCH_INIT ||
      (payload && !(payload as FilterAction).notSearching)
    ) {
      const params = getParamsFromFilters(filters)
      const result = yield call(getSearchSpaces, params)
      yield put(actions.searchSuccess(result))
    }
  } catch (e) {
    console.log(e)
    yield put(actions.searchError(e.message))
  }
}

export function* putURLParamsSaga() {
  const queryString = history.location.search
  const urlParams = new URLSearchParams(queryString)
  const location = urlParams.get('location')
  const lat = urlParams.get('lat')
  const lng = urlParams.get('lon')
  if (location) {
    if (lat && lng) {
      yield put(
        actions.changeFilter({
          type: TypeFilter.where,
          data: { location, latLng: { lat: Number(lat), lng: Number(lng) } },
          notSearching: true,
        }),
      )
    } else {
      yield put(
        actions.changeFilter({
          type: TypeFilter.where,
          data: { location },
          notSearching: true,
        }),
      )
    }
  }
  const radius = urlParams.get('radius')
  if (radius && Number(radius) < 50) {
    yield put(
      actions.changeFilter({
        type: TypeFilter.radius,
        data: radius,
        notSearching: true,
      }),
    )
  }

  const desks = urlParams.get('desks')
  if (desks) {
    yield put(
      actions.changeFilter({
        type: TypeFilter.desks,
        data: desks,
        notSearching: true,
      }),
    )
  }
  const moveInBy = urlParams.get('moveIn')
  if (moveInBy) {
    yield put(
      actions.changeFilter({
        type: TypeFilter.when,
        data: moveInBy,
        notSearching: true,
      }),
    )
  }

  const length = urlParams.get('length')
  if (length) {
    yield put(
      actions.changeFilter({
        type: TypeFilter.length,
        data: length,
        notSearching: true,
      }),
    )
  }
  const maxRent = urlParams.get('maxRent')
  if (maxRent) {
    yield put(
      actions.changeFilter({
        type: TypeFilter.maxRent,
        data: maxRent,
        notSearching: true,
      }),
    )
  }
  yield put(actions.searchInit())
}

function* saga() {
  yield takeLatest(constants.SEARCH_INIT, searchSpacesSaga)
  yield takeLatest(constants.PUT_URL_PARAMS, putURLParamsSaga)
  yield debounce(1000, constants.CHANGE_FILTER, searchSpacesSaga)
}

export default saga
