import { FitoutOptionProps } from 'services/negotiation/types'
import { DropItem } from 'components/OnBoarding/DropZone'
import {
  CommonPhotos1,
  CommonBrochures1,
  CommonFloorPlans,
} from 'services/space/PropertyListingschema'

export interface AmenityOptions {
  [key: string]: {
    desc: string
    checked: boolean
  }
}
export enum AvailabilityFlexPriceInterval {
  Daily = 'Daily',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
}

// this maps to API AvailableSpace and GL FloorsAndUnits
export interface AvailabilityFlex {
  desks: number
  availableFrom: Date
  minLease: number
  price: number
  currencyCode: string
  frequency: AvailabilityFlexPriceInterval
  floor?: number
  id?: string /* Common.Identifier */
}

export enum SpaceStatus {
  New /* Just created */,
  ReadyForPublish /* Form validated and pressed next */,
  Published /* published in Store API */,
  PublishedWithErrors /* published in Store API */,
  ErrorPublishing /* error publishing */,
  PendingUpdate /* edited published space */,
  ErrorUpdating /* error updating */,
}

export interface SpaceData {
  id: string
  type: string
  spaceName: string
  spaceDescription: string
  spaceHighlights: string
  spaceSize: number | undefined
  spaceFloor: number | undefined
  spaceSizeCommon: number | undefined
  spaceMatterPort: string
  spaceFloored: string
  use: string
  spaceRent: number | undefined
  spaceServices: number | undefined
  spaceServicesNotNegotiable: boolean
  availabilityFixed: Date
  months: number | undefined
  hotDesks?: AvailabilityFlex
  fixedDesks?: AvailabilityFlex
  servicedOffices?: Array<AvailabilityFlex>
  images: Array<DropItem>
  floorPlan: Array<DropItem>
  fitout: Array<FitoutOptionProps>
  uploadedImages?: CommonPhotos1
  uploadedFloorPlans?: CommonFloorPlans
  status: SpaceStatus
  address?: string
}

export type SpaceDataMap = { [id: string]: SpaceData }

export interface OnBoardingState {
  buildingId: string | undefined
  isNew: boolean | undefined
  images: Array<DropItem>
  docs: Array<DropItem>
  name: string
  description: string
  address: string
  city: string
  postCode: string
  country: string
  location: string
  district: string
  subdistrict: {
    id: number
    name: string
  }
  latLng: { lat: number; lng: number } | undefined
  amenities: AmenityOptions
  spaces: SpaceDataMap
  spaceCount: number
  error?: string
  uploadedImages?: CommonPhotos1
  uploadedDocs?: CommonBrochures1
  isPublishing?: boolean
  defaultAmenities?: AmenityOptions
}

export interface OnBoardingAction {
  type: string
  payload: OnBoardingState
}

// UrlDto
export interface ImageResource {
  width?: number
  height?: number
  uri: string
  uriExternal?: boolean
  cultureCode?: string
}

export interface ImageResources {
  caption?: string
  resource: Array<ImageResource>
}

export interface BuildingDetails {
  name: string
  address: string
  city: string
  buildingDescription: string
  locationDescription: string
  postCode: string
  latitude: string
  longitude: string
  district: string
  subdistrict: {
    id: number
    name: string
  }
}

export interface PropertyDocuments {
  photos: Array<ImageResources>
  brochures: Array<ImageResources>
  floorPlans: Array<ImageResources>
}

export interface BuildingDTO {
  // BaseProperyDTO
  id: string
  country: string
  culture: string
  propertyDocuments: PropertyDocuments
  amenities: Array<string>
  buildingDetails: BuildingDetails
}

export enum AvailabilityType {
  HotDesk,
  FixedDesk,
  ServicedOffice,
}

export interface ExclusiveSize {
  value: number
  unit: string
}

export interface CommonAreaDTO {
  value: number
  unit: string
}

export interface CommonCharges {
  type: 'Rent' | 'ServiceCharge' | 'PropertyAccommodation'
  value: number
  currencyCode: string
  interval: string
  unit?: string
  negotiable: boolean
  onApplication?: boolean
}

interface FitOutOptionDTO {
  name: string
  description: string
  identifier: string
  charges: CommonCharges
}

export type SpaceLicense = 'OfficeLand' | 'RetailLand' | 'OfficeRetail'

export interface FixedLeaseDetails {
  exclusiveSize: ExclusiveSize
  commonArea: CommonAreaDTO
  floor: number
  charges: Array<CommonCharges>
  propertyType: SpaceLicense
  availableFrom: string
  minLease: number
  fitOutOptions: Array<FitOutOptionDTO>
}

export interface AvailableSpace {
  type: AvailabilityType
  numberOfDesks: number
  availableFrom: string
  minLease: number
  floor?: number
  charges: Array<CommonCharges>
  identifier?: string
}

export interface FlexLeaseDetails {
  availableSpace: Array<AvailableSpace>
}

export interface SpaceDetails {
  fixedLease?: FixedLeaseDetails
  flexLease?: FlexLeaseDetails
  headline: string
  description: string
  spaceHighlights: string
  matterPortUrl: string
  flooredUrl: string
  status?: number
  leaseType: number // 0 = fixed, 1 = flex
}

export interface SpaceDTO {
  // BaseProperyDTO
  id: string
  country: string
  culture: string
  // landlordId: string
  propertyDocuments: PropertyDocuments
  amenities: Array<string>
  buildingId: string
  details: SpaceDetails
  buildingDetails: BuildingDetails
}
