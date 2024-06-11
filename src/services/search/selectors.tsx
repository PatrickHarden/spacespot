import { get, chain } from 'lodash'
import { FilterState, TypeFilter, SearchType } from './types'
import { SpacespotState } from 'services/global/types'
import { Space } from 'services/space/types'
import { isFixed, getDesks } from 'services/space/helpers'

const searchFilters = (state: SpacespotState): FilterState =>
  get(state, 'search.filters')
const selectSearch = (state: SpacespotState): Array<Space> =>
  get(state, 'search.search.Documents[0]')

const searchFiltersWhere = (state: SpacespotState): string => {
  const filters = searchFilters(state)
  return get(filters, `${TypeFilter.where}.location`)
}
const searchFiltersDesks = (state: SpacespotState): number | undefined => {
  const filters = searchFilters(state)
  return get(filters, TypeFilter.desks)
}
const searchFiltersRadius = (state: SpacespotState): number => {
  const filters = searchFilters(state)
  return get(filters, TypeFilter.radius, 0)
}
const searchFiltersWhen = (state: SpacespotState): string => {
  const filters = searchFilters(state)
  return get(filters, TypeFilter.when, '')
}
const searchFiltersLength = (state: SpacespotState): number => {
  const filters = searchFilters(state)
  return get(filters, TypeFilter.length, 0)
}
const searchFiltersType = (state: SpacespotState): SearchType | 0 => {
  const filters = searchFilters(state)
  return get(filters, TypeFilter.type, 0)
}
const searchFiltersMaxRent = (state: SpacespotState): number => {
  const filters = searchFilters(state)
  return get(filters, TypeFilter.maxRent, 0)
}

const filterDesks = (spaces: Array<Space>, desks: number) =>
  spaces.filter((space: Space) =>
    isFixed(space)
      ? Number(getDesks(space)) >= Number(desks) * 0.7 &&
        Number(getDesks(space)) <= Number(desks) * 2
      : get(space, "['Common.FloorsAndUnits']", [])
          .map((floorAndUnit: any) =>
            get(floorAndUnit, "['Common.Areas'][0]['Common.MaxArea']", 0),
          )
          .some(
            (desksSpace: number) =>
              Number(desksSpace) >= Number(desks) * 0.7 &&
              Number(desksSpace) <= Number(desks) * 2,
          ),
  )

const filterWhen = (spaces: Array<Space>, when: string) =>
  spaces.filter((space: Space) =>
    isFixed(space)
      ? new Date(get(space, 'Common.AvailableFrom', '')) < new Date(when)
      : get(space, "['Common.FloorsAndUnits']", [])
          .map((floorAndUnit: any) =>
            get(
              floorAndUnit,
              '["Common.Availability"]["Common.AvailabilityDate"]',
              '',
            ),
          )
          .some((dateSpace: string) => new Date(dateSpace) < new Date(when)),
  )

const filterLength = (spaces: Array<Space>, length: number) =>
  spaces.filter((space: Space) =>
    length === 48
      ? true
      : isFixed(space)
      ? get(
          space,
          '["Common.Availability"]["Common.MinLeaseTerm"]["Common.TermDuration"]',
        ) <= length
      : get(space, "['Common.FloorsAndUnits']", [])
          .map((floorAndUnit: any) =>
            get(
              floorAndUnit,
              '["Common.Availability"]["Common.MinLeaseTerm"]["Common.TermDuration"]',
              0,
            ),
          )
          .some((minLease: number) => minLease <= length),
  )
const filterMaxRent = (spaces: Array<Space>, maxRent: number) =>
  spaces.filter((space: Space) =>
    isFixed(space)
      ? get(space, '["Common.Charges"][0]["Common.Amount"]') <= maxRent
      : get(space, "['Common.FloorsAndUnits']", [])
          .map((floorAndUnit: any) =>
            get(floorAndUnit, '["Common.Charges"][0]["Common.Amount"]', 0),
          )
          .some((minLease: number) => minLease <= maxRent),
  )

const selectSearchedWithFilters = (state: SpacespotState): Array<Space> => {
  const spaces = selectSearch(state)
  return chain(spaces)
    .thru((spaces: Array<Space>) => {
      if (!spaces) return []
      const stateDesks = searchFiltersDesks(state)
      if (stateDesks && stateDesks > 0) {
        return filterDesks(spaces, stateDesks)
      }
      return spaces
    })
    .thru((spaces: Array<Space>) => {
      if (!spaces) return []
      const stateWhen = searchFiltersWhen(state)
      if (stateWhen) {
        return filterWhen(spaces, stateWhen)
      }
      return spaces
    })
    .thru((spaces: Array<Space>) => {
      if (!spaces) return []
      const stateLength = searchFiltersLength(state)
      if (stateLength && stateLength > 0) {
        return filterLength(spaces, stateLength)
      }
      return spaces
    })
    .thru((spaces: Array<Space>) => {
      if (!spaces) return []
      const stateMaxRent = searchFiltersMaxRent(state)
      if (stateMaxRent && stateMaxRent > 0) {
        return filterMaxRent(spaces, stateMaxRent)
      }
      return spaces
    })
    .value()
}
const isAnyFilterSelected = (filters: FilterState): boolean =>
  Boolean(
    filters &&
      ((filters.desks && filters.desks > 0) ||
        filters.when !== '' ||
        (filters.maxRent && filters.maxRent > 0) ||
        (filters.length && filters.length > 0)),
  )

const selectNumSpaces = (state: SpacespotState): number => {
  const filters = searchFilters(state)
  return isAnyFilterSelected(filters)
    ? -1
    : get(state, 'search.search.DocumentCount', 0)
}

export default {
  searchFilters,
  selectSearch,
  searchFiltersWhere,
  searchFiltersDesks,
  searchFiltersRadius,
  searchFiltersWhen,
  searchFiltersLength,
  searchFiltersType,
  searchFiltersMaxRent,
  selectSearchedWithFilters,
  selectNumSpaces,
}
