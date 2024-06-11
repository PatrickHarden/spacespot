import { get } from 'lodash'
import { SpacespotState } from '../global/types'
import {
  OnBoardingState,
  SpaceData,
  SpaceStatus,
  AmenityOptions,
} from './types'
import { TranslatePropSpace } from '../space/types'
import { getRent, getSpace, getAvailability } from './utils'

const onboardingState = (state: SpacespotState): OnBoardingState =>
  get(state, 'onboarding', {} as OnBoardingState)
const onboardingState2Space = (
  state: SpacespotState,
): Array<TranslatePropSpace> => {
  const onboarding: OnBoardingState = get(
    state,
    'onboarding',
    {} as OnBoardingState,
  )

  return Object.keys(onboarding.spaces).map((key: string) => {
    const space: SpaceData = get(onboarding, `spaces[${key}]`)
    const images = [...space.images, ...onboarding.images]
    return {
      images,
      key: space.id,
      buildingId: onboarding.buildingId,
      name: space.spaceName,
      address: onboarding.address,
      city: onboarding.city,
      postCode: onboarding.postCode,
      country: onboarding.country,
      description: space.spaceDescription,
      latLng: onboarding.latLng
        ? { lat: onboarding.latLng.lat, lng: onboarding.latLng.lng }
        : { lat: 0, lng: 0 },
      district: onboarding.district,
      subdistrict: onboarding.subdistrict,
      aspects: null,
      floor: space.spaceFloor || 0,
      type: space.type,
      rent: getRent(space).toString(),
      size: getSpace(onboarding, key),
      availability: getAvailability(space),
      isNew: space.status === SpaceStatus.New,
      hotDesks: get(space, 'hotDesks.desks', 0),
      fixedDesks: get(space, 'fixedDesks.desks', 0),
      sevicedOffices: get(space, 'servicedOffices.length', 0),
      status: get(space, 'status'),
    }
  })
}

const onboardingIsPublishing = (state: SpacespotState): boolean =>
  get(state, 'onboarding.isPublishing', false)

const defaultAmenities = (state: SpacespotState): AmenityOptions =>
  get(state, 'onboarding.defaultAmenities')

const onboardingCountry = (state: SpacespotState): string =>
  get(state, 'onboarding.country', 'NO')

export default {
  defaultAmenities,
  onboardingCountry,
  onboardingState,
  onboardingState2Space,
  onboardingIsPublishing,
}
