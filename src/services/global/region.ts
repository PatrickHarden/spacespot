/* Region config */
import { get } from 'lodash'

interface RegionConfig {
  currencyCode: string
  currencyDesc: string
  glRegionSizeUnit: string // This is to pass Backend eg: GL API
  regionSizeDesc: string
}

const cfg: { [key: string]: RegionConfig } = {
  NO: {
    currencyCode: 'NOK',
    currencyDesc: 'Kr',
    glRegionSizeUnit: 'sqm',
    regionSizeDesc: 'm\u00b2',
  },
  ES: {
    currencyCode: 'EUR',
    currencyDesc: '€',
    glRegionSizeUnit: 'sqm',
    regionSizeDesc: 'm\u00b2',
  },
  FI: {
    currencyCode: 'EUR',
    currencyDesc: '€',
    glRegionSizeUnit: 'sqm',
    regionSizeDesc: 'm\u00b2', // for UI we showing as m²
  },
  UK: {
    currencyCode: 'GBP',
    currencyDesc: '£',
    glRegionSizeUnit: 'sqm',
    regionSizeDesc: 'm\u00b2',
  },
  DE: {
    currencyCode: 'EUR',
    currencyDesc: '€',
    glRegionSizeUnit: 'sqm',
    regionSizeDesc: 'm\u00b2',
  },
}

export const getRegionCurrencyDesc = (country: string) =>
  get(cfg[country], 'currencyDesc', 'Kr')

export const getRegionCurrencyCode = (country: string) =>
  get(cfg[country], 'currencyCode', 'NOK')

export const getGLRegionSizeUnit = (country: string) =>
  get(cfg[country], 'glRegionSizeUnit', 'sqm')

export const getRegionSizeDesc = (country: string) =>
  get(cfg[country], 'regionSizeDesc', 'm\u00b2')

export const getRegion = () => 'Oslo'
export const getRegionRadiusType = () => 'Miles'
export const getRegionSite = () => 'all-spacespot'
