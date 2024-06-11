import { get, chain } from 'lodash'
import { Space } from './types'
import {
  CommonChargeType,
  CommonImage,
  ImageResource,
  CommonPostalAddress,
  CommonActualAddress,
} from 'services/space/PropertyListingschema'
import { FLEX_TYPE_CONSTANT, FIXED_TYPE_CONSTANT } from '../onboarding/utils'
import { routingLang } from 'intl'

import CONFIG from 'config'

export const generateGallery = (item: any) => {
  const [url] = item['Common.ImageResources'].filter(
    (photo: any) => photo['Common.Breakpoint'] === 'small',
  )
  const alt = item['Common.ImageCaption']
  return {
    url: url['Source.Uri'],
    alt,
  }
}

type Charges = {
  rent: number
  serviceCharges: number
  additionalCosts: number
  currencyCode: string
  total: number
}

export const getCharges = (space: Space) => {
  let charges: Charges = {
    rent: 0,
    serviceCharges: 0,
    additionalCosts: 0,
    currencyCode: 'EUR',
    total: 0,
  }
  const ccharges: Array<CommonChargeType> = get(space, 'Common.Charges', [])
  charges = ccharges.reduce((acc, charge) => {
    const kind = charge['Common.ChargeKind']
    const value = charge['Common.Amount'] || 0
    const currency = charge['Common.CurrencyCode']
    if (currency) {
      acc.currencyCode = currency
    }
    switch (kind) {
      case 'Rent':
        acc.rent = value
        break
      case 'ServiceCharge':
        acc.serviceCharges += value
        break
      default:
        acc.additionalCosts += value
    }
    acc.total += value
    return acc
  }, charges)
  return charges
}

export const getImages = (space: Space) => {
  const photos = get(space, 'Common.Photos')
  const urls = photos
    ? photos.map((item: CommonImage) => {
      const [original] = item['Common.ImageResources'].filter(
        (photo: ImageResource) => photo['Common.Breakpoint'] === 'original',
      )
      const [small] = item['Common.ImageResources'].filter(
        (photo: ImageResource) => photo['Common.Breakpoint'] === 'small',
      )
      return {
        original:
          original['Source.Uri'] ||
          CONFIG.GL_PHOTO_HOST + original['Common.Resource.Uri'],
        thumbnail:
          small['Source.Uri'] ||
          CONFIG.GL_PHOTO_HOST + small['Common.Resource.Uri'],
      }
    })
    : []
  return urls
}

export const getFloorPlans = (space: Space) => {
  const floorPlans = get(space, 'Common.FloorPlans')
  const urls = floorPlans
    ? floorPlans.map((item: CommonImage) => {
      const original = item['Common.ImageResources'][0]
      return {
        original:
          original['Source.Uri'] ||
          CONFIG.GL_PHOTO_HOST + original['Common.Resource.Uri'],
        thumbnail:
          original['Source.Uri'] ||
          CONFIG.GL_PHOTO_HOST + original['Common.Resource.Uri'],
      }
    })
    : []
  return urls
}

export const getPhoto = (space: Space): string => {
  const photo = chain(space)
    .get('Common.Photos')
    .head()
    .get('Common.ImageResources')
    .filter((img: ImageResource) => img['Common.Breakpoint'] === 'small')
    .head()
    .get('Source.Uri')
    .value()
  return photo || ''
}

export const getType = (space: Space) =>
  get(space, 'Common.UsageType') === 'Office' //FIXME when mapping changes
    ? FIXED_TYPE_CONSTANT
    : FLEX_TYPE_CONSTANT

export const isFixed = (space: Space) => getType(space) === FIXED_TYPE_CONSTANT

export const getSize = (space: Space) => {
  if (isFixed(space)) {
    return get(space, "['Common.MinimumSize'][0]['Common.Size']", 0)
  }
  return 0 // FIXME
}

/**
 * Size units (i.e: sqm)
 */
export const getSizeUnits = (space: Space) => {
  if (isFixed(space)) {
    return get(space, "['Common.MinimumSize'][0]['Common.Units']", 0)
  }
  return 0 // FIXME
}

/**
 * Calculate desks from size for fixed spaces
 *
 * desks = size in sqm / 15
 *
 * - For flex/coworking returns empty string
 * - If units != sqm or sqft, returns size with units
 *
 */
export const getDesks = (space: Space) => {
  if (isFixed(space)) {
    const sz: number = getSize(space)
    const units = getSizeUnits(space)
    if (units === 'sqm' || units === 'm2') {
      return (sz / 15).toFixed()
    } else if (units === 'sqft') {
      return ((sz * 0.092903) / 15).toFixed()
    } else {
      // unknown units
      return `${sz} ${units}`
    }
  }
  return ''
}

/**
 * Get common area (shared) size
 *
 * Shared common area = TotalSize - Size
 */
export const getSizeCommon = (space: Space) => {
  if (isFixed(space)) {
    return (
      get(space, "['Common.TotalSize'][0]['Common.Size']", 0) - getSize(space)
    )
  }
  return 0
}

export const getFloor = (space: Space) => get(space, 'Common.FloorNumber')

const getPostalAddress = (space: Space): CommonPostalAddress => {
  const actual: CommonActualAddress = get(space, 'Common.ActualAddress')
  const postal: Array<CommonPostalAddress> = get(
    actual,
    'Common.PostalAddresses',
    [],
  )
  return postal[0]
}

export const getLocation = (space: Space) =>
  get(space, '["Common.LocationDescription"][0]["Common.Text"]')

export const getTitle = (space: Space): string =>
  get(
    space,
    '["Common.Strapline"][0]["Common.Text"]',
    get(getPostalAddress(space), 'Common.Line1', ''),
  )

export const getStreet = (space: Space): string => {
  const address = getPostalAddress(space)
  return get(address, 'Common.Line2', get(address, 'Common.Line1', ''))
}

export const getDistrict = (space: Space) => {
  const address = getPostalAddress(space)
  return get(address, 'Common.Line3', '')
}

export const getSubdistrict = (space: Space) => {
  const address = getPostalAddress(space)
  return {
    id: 0,
    name: get(address, 'Common.Line4', ''),
  }
}

export const getCity = (space: Space): string => {
  const address = getPostalAddress(space)
  return get(address, 'Common.Locallity', '')
}

export const getPK = (space: Space): string =>
  get(space, 'Common.PrimaryKey', '')

export const getSpaceURI = (space: Space): string => {
  const office = routingLang({ nb: 'kontor', default: 'office' })
  const coworking = 'coworking'

  const id = getPK(space)
  const address = getStreet(space).replace(/\//g, '-')
  const district = (getDistrict(space) || 'NA').replace(/\//g, '-')
  const subdistrict = (getSubdistrict(space).name || 'NA').replace(/\//g, '-')
  const city = getCity(space)
  const title = getTitle(space).replace(/\//g, '-')
  const stype = isFixed(space) ? office : coworking
  const uri = `detail/${stype}/${city}/${district}/${subdistrict}/${id}/${title}-${address}`
  const repKeys: { [key: string]: string } = {
    æ: 'ae',
    å: 'aa',
    ø: 'oe',
    Æ: 'Ae',
    Å: 'Aa',
    Ø: 'Oe',
    á: 'a',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    Á: 'A',
    É: 'E',
    Í: 'I',
    Ó: 'O',
    Ú: 'U',
    '–': '-',
    '|': '-',
    ä: 'a',
    ë: 'e',
    ï: 'i',
    ö: 'o',
    ü: 'u',
    Ä: 'A',
    Ë: 'E',
    Ï: 'I',
    Ö: 'O',
    Ü: 'U',
  }
  return uri
    .replace(/['()&?,. ]/g, '-')
    .replace(/\*/g, '-')
    .replace(/[æåøÆÅØáéíóúÁÉÍÓÚ–|äëïöüÄËÏÖÜ]/g, char => repKeys[char] || '')
    .replace(/-+/g, '-')
}
