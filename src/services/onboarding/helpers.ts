import { get, cloneDeep } from 'lodash'
import { Space } from 'services/space/types'
import spaceSelectors from 'services/space/selectors'
import {
  AmenityOptions,
  OnBoardingState,
  AvailabilityFlexPriceInterval,
  AvailabilityFlex,
} from 'services/onboarding/types'

export const aspects2Amenities = (
  amenities: AmenityOptions,
  aspects: Array<string>,
): AmenityOptions => {
  const newAmenities = cloneDeep(amenities) || {}
  if (!aspects) {
    return newAmenities
  }
  aspects.forEach(key => {
    if (newAmenities[key]) {
      newAmenities[key].checked = true
    } else {
      newAmenities[key] = {
        checked: true,
        desc: key,
      }
    }
  })
  return newAmenities
}

export const loadOnboardingSpace = (
  defaultAmenities: AmenityOptions | undefined,
  space: Space,
  isBuilding: boolean,
): OnBoardingState => {
  const building = spaceSelectors.translateBuilding(space, isBuilding)
  return {
    buildingId: building.buildingId,
    isNew: false,
    images: building.images || [],
    docs: [],
    name: building.name,
    description: building.description,
    address: building.address,
    city: building.city,
    postCode: building.postCode,
    country: building.country,
    location: building.location || '',
    latLng: building.latLng,
    district: building.district,
    subdistrict: building.subdistrict,
    amenities: aspects2Amenities(
      defaultAmenities || {},
      get(space, 'Common.Aspects', []),
    ),
    spaces: isBuilding ? {} : spaceSelectors.translateSpace(space),
    spaceCount: 0,
    uploadedImages: building.uploadedImages,
    uploadedDocs: building.uploadedDocs,
    isPublishing: false,
    defaultAmenities: defaultAmenities,
  }
}

const defaultDate = new Date()
defaultDate.setDate(new Date().getDate() + 1)

export const getDefaultAvailability = (): AvailabilityFlex => ({
  desks: 0,
  availableFrom: defaultDate,
  minLease: 0,
  price: 0,
  currencyCode: 'NOK',
  frequency: AvailabilityFlexPriceInterval.Monthly,
})
