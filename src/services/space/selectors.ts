import { get, chain, head } from 'lodash'
import { SpacespotState } from 'services/global/types'
import { SpaceSearchResponse, Space, TranslatePropSpace } from './types'

import { CommonActualAddress, CommonChargeType } from './PropertyListingschema'

import {
  SpaceDataMap,
  SpaceStatus,
  SpaceData,
  AmenityOptions,
  AvailabilityFlex,
} from 'services/onboarding/types'

import {
  getPK,
  getSizeCommon,
  getSize,
  getPhoto,
  getType,
  isFixed,
  getDistrict,
  getSubdistrict,
  getStreet,
  getTitle,
  getLocation,
  getCity,
} from 'services/space/helpers'

import { getUserLanguage } from 'intl'

const selectSearch = (state: SpacespotState): SpaceSearchResponse =>
  get(state, 'space.search')
const selectSpaceItem = (state: SpacespotState): Space =>
  get(state, 'space.item')

const getPostCode = (space: Space): string => {
  const actual: CommonActualAddress = get(space, 'Common.ActualAddress')
  return get(actual, 'Common.PostCode', '')
}

export const getCountry = (space: Space): string => {
  const actual: CommonActualAddress = get(space, 'Common.ActualAddress')
  return get(actual, 'Common.Country', 'NO')
}

const getRentHead = (space: Space): CommonChargeType | undefined =>
  chain(space)
    .get('Common.Charges')
    .filter(charge => charge['Common.ChargeKind'] === 'Rent')
    .head()
    .value()

const getRent = (space: Space): string => {
  const rent = getRentHead(space)
  if (!rent) return ''
  const amount = get(rent, 'Common.Amount', 0)
  //const currencyCode = get(rent, 'Common.CurrencyCode', '')
  //return formatCurrency(amount, currencyCode)
  // getRent returns only amount instead of amount with currency eg: 1000
  // but earlier it was 1000 €
  return amount.toString()
}

export const getDescription = (space: Space, locale: string) => {
  const cdesc = get(space, 'Common.LongDescription', [])
  const desc = cdesc.filter(d => d['Common.CultureCode'] === locale)
  const defaultDesc = cdesc.filter(d => d['Common.CultureCode'] === 'en-GB')
  return get(head(desc.concat(defaultDesc)) || head(cdesc), 'Common.Text', '')
}

const getLatLng = (space: Space): { lat: number; lng: number } => {
  const coords = get(space, 'Common.Coordinate', { lat: 0, lon: 0 })
  return {
    lat: coords.lat,
    lng: coords.lon,
  }
}

const getFlexArrays = (space: Space) => {
  const flexArray = get(space, 'Common.FloorsAndUnits')
  if (!flexArray) return undefined
  const filteredArray = flexArray.filter(
    (type: any) => get(type, "['Common.Areas'][0]['Common.MaxArea']", 0) === 0,
  )

  if (filteredArray.length === 0) return flexArray
  return filteredArray
}

const getAvailability = (space: Space) => {
  if (get(space, 'Common.IsParent') === true) {
    return undefined
  }
  if (isFixed(space)) {
    return new Date(get(space, 'Common.AvailableFrom', ''))
  }
  const FlexArray = getFlexArrays(space)
  return new Date(get(FlexArray, "[0]['Common.AvailableFrom']", ''))
}

const getFlexDesks = (space: Space, use: string): number =>
  chain(space)
    .get('Common.FloorsAndUnits')
    .filter((type: any) => get(type, 'Common.Unit.Use') === use)
    .head()
    .get("['Common.Areas'][0]['Common.MaxArea']")
    .value() || 0

const getFlexHotDesks = (space: Space): number => getFlexDesks(space, 'HotDesk')
const getFlexFixedDesks = (space: Space): number =>
  getFlexDesks(space, 'FixedDesk')
const getFlexServicedOffices = (space: Space): number =>
  chain(space)
    .get('Common.FloorsAndUnits')
    .filter((type: any) => get(type, 'Common.Unit.Use') === 'ServicedOffice')
    .value().length

const translateBuilding = (
  space: Space,
  isBuilding: boolean,
): TranslatePropSpace => ({
  photo: getPhoto(space),
  key: getPK(space),
  buildingId: isBuilding ? getPK(space) : get(space, 'Common.ParentProperty'),
  name: getTitle(space),
  address: getStreet(space),
  city: getCity(space),
  postCode: getPostCode(space),
  country: getCountry(space),
  description: getDescription(space, getUserLanguage()),
  location: getLocation(space),
  latLng: getLatLng(space),
  district: getDistrict(space),
  subdistrict: getSubdistrict(space),
  aspects: get(space, 'Common.Aspects'),
  rent: getRent(space),
  size: getSize(space),
  floor: get(space, 'Common.FloorNumber', 0),
  availability: getAvailability(space),
  type: getType(space),
  hotDesks: getFlexHotDesks(space),
  fixedDesks: getFlexFixedDesks(space),
  sevicedOffices: getFlexServicedOffices(space),
  uploadedImages: get(space, 'Common.Photos'),
  uploadedDocs: get(space, 'Common.Brochures'),
  status: SpaceStatus.Published,
})

const getSpaceCharge = (space: Space, kind: string) =>
  chain(space)
    .get('Common.Charges')
    .filter((charge: any) => get(charge, 'Common.ChargeKind') === kind)
    .head()
    .get('Common.Amount')
    .value()

export const getSpaceRent = (space: Space) => getSpaceCharge(space, 'Rent')

const getSpaceServices = (space: Space) =>
  getSpaceCharge(space, 'ServiceCharge')

const getHighLigths = (space: Space) =>
  get(space, '["Common.Highlights"][0]["Common.Highlight"][0]["Common.Text"]')

export const getFlexAvailability = (
  space: Space,
  type: string,
): AvailabilityFlex | Array<AvailabilityFlex> | undefined => {
  const availability = chain(space)
    .get('Common.FloorsAndUnits')
    .filter(
      availabilityType => get(availabilityType, 'Common.Unit.Use') === type,
    )
    .map(item => ({
      desks:
        get(item, '["Common.Areas"][0]["Common.MaxArea"]') ||
        get(item, '["Dynamic.TotalDesks"]'),
      availableFrom: new Date(
        get(item, '["Common.Availability"]["Common.AvailabilityDate"]', ''),
      ),
      minLease: get(
        item,
        '["Common.Availability"]["Common.MinLeaseTerm"]["Common.TermDuration"]',
      ),
      price: get(item, '["Common.Charges"][0]["Common.Amount"]'),
      currencyCode: get(item, '["Common.Charges"][0]["Common.CurrencyCode"]'),
      frequency: get(item, '["Common.Charges"][0]["Common.Interval"]'),
      floor: get(item, 'Common.FloorNumber'),
      id: get(item, 'Common.Identifier'),
    }))
    .value()
  if (!availability) return undefined
  return type === 'ServicedOffice' ? availability : availability[0]
}

const USE_CONSTANTS_MAP = {
  OfficeLand: 'OFFICE',
  RetailLand: 'RETAIL',
  OfficeAndRetail: 'OFFICE_RETAIL', //FIXME? which is the map for Office and reatil
}
const getUse = (space: Space) =>
  get(USE_CONSTANTS_MAP, get(space, 'Common.PropertySubType', 'OfficeLand'))

const getSpaceServicesNegotiable = (space: Space) => {
  if (isFixed(space)) {
    return (
      chain(space)
        .get('Common.Charges')
        .filter(
          (charge: any) => get(charge, 'Common.ChargeKind') === 'ServiceCharge',
        )
        .head()
        .get('Common.ChargeModifer')
        .value() === 'Fixed'
    )
  }
  return false
}

const getFitout = (space: Space) => {
  const fitout = get(space, 'Common.FitOutOptions')
  if (!fitout) return []
  return fitout.map((fitout: any) => ({
    id: get(fitout, 'Common.Identifier'),
    isCustom: false,
    name: get(fitout, '["Common.Name"][0]["Common.Text"]'),
    description: get(fitout, '["Common.Description"][0]["Common.Text"]'),
    amount: get(fitout, '["Common.Charges"][0]["Common.Amount"]'),
  }))
}
const getFitoutCustom = (fitout: any) =>
  fitout.map((fitout: any) => ({
    id: get(fitout, 'id'),
    isCustom: true,
    name: get(fitout, 'name'),
    description: get(fitout, 'description'),
    amount: get(fitout, 'amount'),
  }))
const selectSpaceFitout = (state: SpacespotState) => [
  ...getFitout(get(selectSpaceItem(state), 'Document')),
  ...getFitoutCustom(get(state, 'negotiation.customFitout', [])),
]

export const toSpaceData = (space: Space): SpaceData => ({
  id: getPK(space),
  address: getStreet(space),
  type: getType(space),
  spaceName: getTitle(space),
  spaceDescription: getDescription(space, getUserLanguage()),
  spaceHighlights: getHighLigths(space),
  spaceSize: getSize(space),
  spaceFloor: get(space, 'Common.FloorNumber', 0),
  spaceSizeCommon: getSizeCommon(space),
  spaceMatterPort: get(space, 'Common.Walkthrough', ''),
  spaceFloored: get(space, 'Common.FlooredURL', ''),
  use: getUse(space),
  spaceRent: getSpaceRent(space),
  spaceServices: getSpaceServices(space),
  spaceServicesNotNegotiable: getSpaceServicesNegotiable(space),
  availabilityFixed: new Date(get(space, 'Common.AvailableFrom', '')),
  months: get(
    space,
    '["Common.Availability"]["Common.MinLeaseTerm"]["Common.TermDuration"]',
  ),
  hotDesks: getFlexAvailability(space, 'HotDesk') as AvailabilityFlex,
  fixedDesks: getFlexAvailability(space, 'FixedDesk') as AvailabilityFlex,
  servicedOffices: getFlexAvailability(space, 'ServicedOffice') as Array<
    AvailabilityFlex
  >,
  images: [],
  floorPlan: [],
  fitout: getFitout(space),
  status: SpaceStatus.Published,
  uploadedImages: get(space, 'Common.Photos'),
  uploadedFloorPlans: get(space, 'Common.FloorPlans'),
})

const translateSpace = (space: Space): SpaceDataMap => ({
  [getPK(space)]: toSpaceData(space),
})

const selectSpaceError = (state: SpacespotState) =>
  get(selectSpaceItem(state), 'error')

const selectSpaceItems = (state: SpacespotState) => get(state, 'space.items')

const selectSpace = (id: string) => (state: SpacespotState) => {
  return chain(selectSpaceItems(state))
    .get(id)
    .value()
}

const selectedSpace = (state: SpacespotState): Space =>
  get(state, 'space.selectedSpace.Document')

const parentSpace = (state: SpacespotState): Space =>
  get(state, 'space.parentSpace.Document')

const regionAmenities = (state: SpacespotState): AmenityOptions =>
  get(state, 'space.regionAmenities')

export default {
  isFixed,
  getAvailability,
  getRent,
  selectSearch,
  selectSpaceFitout,
  translateBuilding,
  translateSpace,
  selectSpaceError,
  selectedSpace,
  parentSpace,
  regionAmenities,
  getFlexAvailability,
  selectSpace,
  selectSpaceItem,
}
