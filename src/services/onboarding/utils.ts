import { get } from 'lodash'
import moment from 'moment'
import {
  OnBoardingState,
  SpaceData,
  AvailabilityFlex,
} from 'services/onboarding/types'
import { TranslatePropSpace } from 'services/space'

const FLEX_TYPE_CONSTANT = 'FLEX'
const FIXED_TYPE_CONSTANT = 'FIXED'

const processDate = (date: Date) => moment(date).format('DD.MM.YYYY')
const getTypeFlex = (space: SpaceData): AvailabilityFlex => {
  const filteredTypes = ['hotDesks', 'fixedDesks', 'servicedOffices'].filter(
    (type: string) =>
      get(space, `${type}.desks`) > 0 &&
      get(space, `${type}.minLease`) > 0 &&
      get(space, `${type}.price`) > 0,
  )
  return filteredTypes[0] ? get(space, filteredTypes[0]) : {}
}

const isSpaceFlex = (space: SpaceData | TranslatePropSpace) =>
  space.type === FLEX_TYPE_CONSTANT
const createSpaceFlex = (space: SpaceData) =>
  isSpaceFlex(space)
    ? {
      availableFrom: processDate(
        getTypeFlex(space).availableFrom || new Date(),
      ),
    }
    : null

const isSpaceFixed = (space: SpaceData | TranslatePropSpace) =>
  space.type === FIXED_TYPE_CONSTANT
const createSpaceFixed = (space: SpaceData) =>
  isSpaceFixed(space)
    ? {
      availableFrom: processDate(get(space, 'availabilityFixed')),
    }
    : null

const formatFloor = (floorNum: number, floorStr: string, country: string,) => {
  if (!floorNum) {
    return ''
  }
  if (country === 'FI' || country === 'NO') {
    return `${floorNum}. ${floorStr}`
  }
  const r = floorNum % 10
  const sufix =
    (floorNum % 100) / 10 === 1
      ? 'th'
      : r === 1
        ? 'st'
        : r === 2
          ? 'nd'
          : r === 3
            ? 'rd'
            : 'th'
  return `${floorNum}${sufix} ${floorStr}`
}

const showAvailabilityDatePast = (availability: Date, showNow: string) =>
  availability && availability < new Date()
    ? moment(availability).fromNow()
    : showNow

const showAvailabilityDate = (availability: Date, showNow: string) =>
  availability > new Date()
    ? moment(availability).format('DD.MM.YYYY')
    : showNow

const showAvailability = (space: TranslatePropSpace, showNow: string) => {
  if (!space.availability) return showNow
  return showAvailabilityDate(new Date(space.availability), showNow)
}

const getAvailability = (space: SpaceData): Date => {
  if (space.type === FIXED_TYPE_CONSTANT) return space.availabilityFixed

  const typeFlex = getTypeFlex(space)
  if (!typeFlex.availableFrom) return new Date()
  return typeFlex.availableFrom
}

const getSpace = (building: OnBoardingState, index: string): number => {
  const space = building.spaces[index]
  if (space.type === FIXED_TYPE_CONSTANT) return space.spaceSize || 0
  const typeFlex = getTypeFlex(space)
  return typeFlex.desks || 0
}
const getRent = (space: SpaceData): number => {
  if (space.type === FIXED_TYPE_CONSTANT) return space.spaceRent || 0
  const typeFlex = getTypeFlex(space)
  return typeFlex.price || 0
}

export {
  FLEX_TYPE_CONSTANT,
  FIXED_TYPE_CONSTANT,
  processDate,
  isSpaceFlex,
  isSpaceFixed,
  getTypeFlex,
  formatFloor,
  createSpaceFlex,
  createSpaceFixed,
  showAvailability,
  showAvailabilityDate,
  showAvailabilityDatePast,
  getAvailability,
  getSpace,
  getRent,
}
