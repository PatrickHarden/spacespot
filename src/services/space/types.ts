import { SpacespotErrorApi } from 'services/global/types'
import {
  PropertyListing,
  CommonPhotos1,
  CommonBrochures1,
} from './PropertyListingschema'
import { DropItem } from 'components/OnBoarding/DropZone'
import { SpaceStatus, AmenityOptions } from 'services/onboarding/types'

export type Space = PropertyListing

// SpaceSpot types
export interface SearchOptions {
  region: string
  locale: string
  landLord?: string
  isParent?: boolean
  parentProperty?: string
}

export interface FilterOptions {
  filters: FilterState
  locale: string
  isParent?: boolean
}

export type FilterState = {
  [key: string]: string | Array<string>
}

export interface SpaceState {
  search?: SpaceSearchResponse | SpacespotErrorApi
  selectedSpace?: SpaceGetResponse
  parentSpace?: SpaceGetResponse
  regionAmenities?: AmenityOptions
  item?: SpaceGetResponse | SpacespotErrorApi
  items?: { [key: string]: Space | SpacespotErrorApi }
}

export interface SpaceGetResponse {
  Found: boolean
  ElapsedTime: string
  Document: Space
}

export interface SpaceSearchResponse {
  Found: boolean
  DocumentCount: number
  Documents: Array<Array<Space>>
  Document?: Space
  Took: string
}

export interface SpaceAction {
  type: string
  payload?:
    | SpaceGetResponse
    | SpaceSearchResponse
    | Space
    | SearchOptions
    | string
    | AmenityOptions
    | FilterOptions
    | FilterState
}

export interface TranslatePropSpace {
  images?: Array<DropItem>
  photo?: string
  key: string
  buildingId?: string
  name: string
  address: string
  city: string
  postCode: string
  country: string
  description: string
  location?: string
  floor: number
  latLng: { lat: number; lng: number }
  district: string
  subdistrict: {
    id: number
    name: string
  }
  type: string
  size: number
  rent: string
  availability?: Date
  aspects: any
  isNew?: boolean
  status: SpaceStatus
  hotDesks: number
  fixedDesks: number
  sevicedOffices: number
  uploadedImages?: CommonPhotos1
  uploadedDocs?: CommonBrochures1
}
