import { DropItem } from 'components/OnBoarding/DropZone'
import types from 'services/onboarding/constants'
import {
  OnBoardingState,
  SpaceData,
  AvailabilityFlex,
  AmenityOptions,
  SpaceStatus,
  SpaceDataMap,
} from 'services/onboarding/types'
import {
  aspects2Amenities,
  loadOnboardingSpace,
  getDefaultAvailability,
} from './helpers'
import { BuildingFormFields } from 'components/OnBoarding/BuildingDetailsForm'

const defaultDate = new Date()
defaultDate.setDate(new Date().getDate() + 1)

const initialAvailability: AvailabilityFlex = getDefaultAvailability()

const initialSpace: SpaceData = {
  id: '0',
  type: '',
  spaceName: '',
  spaceDescription: '',
  spaceHighlights: '',
  spaceSize: undefined,
  spaceSizeCommon: undefined,
  spaceFloor: undefined,
  spaceMatterPort: '',
  spaceFloored: '',
  use: 'OFFICE',
  spaceRent: undefined,
  spaceServices: undefined,
  spaceServicesNotNegotiable: false,
  availabilityFixed: defaultDate,
  months: undefined,
  hotDesks: initialAvailability,
  fixedDesks: initialAvailability,
  servicedOffices: [],
  images: [],
  floorPlan: [],
  fitout: [],
  status: SpaceStatus.New,
}

export const initialState: OnBoardingState = {
  isNew: undefined,
  buildingId: undefined,
  images: [] as Array<DropItem>,
  docs: [] as Array<DropItem>,
  name: '',
  description: '',
  address: '',
  city: '',
  postCode: '',
  country: '',
  location: '',
  district: '',
  subdistrict: {
    id: 0,
    name: '',
  },
  latLng: undefined,
  amenities: {} as AmenityOptions,
  spaces: { '0': initialSpace },
  spaceCount: 1,
  isPublishing: false,
}

const setSpaceField = (state: OnBoardingState, action: any, field: string) => {
  const id = action.payload.id
  const nspaces = { ...state.spaces }
  if (!nspaces[id]) {
    nspaces[id] = { ...initialSpace }
  }
  nspaces[id] = { ...nspaces[id], [field]: action.payload.value }
  return {
    ...state,
    spaces: nspaces,
  }
}

const newSpace = (
  state: OnBoardingState,
  key: string | null,
): OnBoardingState => {
  const sampleSpace: SpaceData = key ? state.spaces[key] : initialSpace
  return {
    ...state,
    spaces: {
      ...state.spaces,
      [state.spaceCount]: {
        ...sampleSpace,
        id: state.spaceCount.toString(),
      },
    },
    spaceCount: state.spaceCount + 1,
  }
}

const resetSpaces = (state: OnBoardingState) => {
  return {
    ...state,
    spaces: { '0': initialSpace },
  }
}

const deleteSpace = (state: OnBoardingState, key: string) => {
  const newSpaces = Object.keys(state.spaces)
    .filter((spaceKey: string) => spaceKey !== key)
    .reduce(
      (previous: SpaceDataMap, spaceKey: string) => ({
        ...previous,
        [spaceKey]: state.spaces[spaceKey],
      }),
      {},
    )
  return {
    ...state,
    spaces: newSpaces,
  }
}

const spaceReducer = (state: OnBoardingState, action: any) => {
  switch (action.type) {
    case types.SET_SPACE_TYPE:
      return setSpaceField(state, action, 'type')
    case types.SET_SPACE_NAME:
      return setSpaceField(state, action, 'spaceName')
    case types.SET_SPACE_DESCRIPTION:
      return setSpaceField(state, action, 'spaceDescription')
    case types.SET_SPACE_HIGHLIGHTS:
      return setSpaceField(state, action, 'spaceHighlights')
    case types.SET_SPACE_SIZE:
      return setSpaceField(state, action, 'spaceSize')
    case types.SET_SPACE_SIZE_COMMON:
      return setSpaceField(state, action, 'spaceSizeCommon')
    case types.SET_SPACE_FLOOR:
      return setSpaceField(state, action, 'spaceFloor')
    case types.SET_SPACE_MATTER_PORT:
      return setSpaceField(state, action, 'spaceMatterPort')
    case types.SET_SPACE_FLOORED:
      return setSpaceField(state, action, 'spaceFloored')
    case types.SET_SPACE_USE:
      return setSpaceField(state, action, 'use')
    case types.SET_SPACE_RENT:
      return setSpaceField(state, action, 'spaceRent')
    case types.SET_SPACE_SERVICES:
      return setSpaceField(state, action, 'spaceServices')
    case types.SET_SPACE_SERVICES_NOT_NEGOTIABLE:
      return setSpaceField(state, action, 'spaceServicesNotNegotiable')
    case types.SET_SPACE_AVAILABILITY_FIXED:
      return setSpaceField(state, action, 'availabilityFixed')
    case types.SET_SPACE_MONTHS:
      return setSpaceField(state, action, 'months')
    case types.SET_SPACE_HOT_DESKS:
      return setSpaceField(state, action, 'hotDesks')
    case types.SET_SPACE_FIXED_DESKS:
      return setSpaceField(state, action, 'fixedDesks')
    case types.SET_SPACE_SERVICED_OFFICES:
      return setSpaceField(state, action, 'servicedOffices')
    case types.SET_SPACE_IMAGES:
      return setSpaceField(state, action, 'images')
    case types.SET_SPACE_FLOORPLAN:
      return setSpaceField(state, action, 'floorPlan')
    case types.SET_SPACE_FITOUT:
      return setSpaceField(state, action, 'fitout')
    case types.SET_SPACE_UPLOADED_IMAGES:
      return setSpaceField(state, action, 'uploadedImages')
    case types.SET_SPACE_UPLOADED_FLOORPLANS:
      return setSpaceField(state, action, 'uploadedFloorPlans')
    case types.SET_SPACE_STATUS:
      return setSpaceField(state, action, 'status')
    case types.RESET_SPACES:
      return resetSpaces(state)
    default:
      return state
  }
}

const clearAmenities = (amenities: AmenityOptions) => {
  const newAmenities: AmenityOptions = Object.keys(amenities).reduce(
    (prev, key) => {
      prev[key] = amenities[key]
      prev[key].checked = false
      return prev
    },
    {} as AmenityOptions,
  )
  return newAmenities
}

const updateBuilding = (
  state: OnBoardingState,
  payload: BuildingFormFields,
) => {
  return {
    ...state,
    /*
    name: payload.address,
    description: payload.address,
    latLng: payload.latLng,
    address: payload.address,
    postCode: payload.postCode,
    city: payload.city,
    location: payload.location,
    country: payload.country ? payload.country : state.country,
    */
    district: payload.district,
    subdistrict: { ...payload.subdistrict },
  }
}

const reducer = (state: OnBoardingState = initialState, action: any) => {
  switch (action.type) {
    case types.CLEAR:
      return {
        ...initialState,
        defaultAmenities: state.defaultAmenities,
        amenities: clearAmenities(state.amenities),
      }
    case types.SET_IS_NEW:
      return { ...state, isNew: action.payload }
    case types.SET_IMAGES:
      return { ...state, images: action.payload }
    case types.SET_UPLOADED_IMAGES:
      return { ...state, uploadedImages: action.payload }
    case types.SET_DOCS:
      return { ...state, docs: action.payload }
    case types.SET_UPLOADED_DOCS:
      return { ...state, uploadedDocs: action.payload }
    case types.SET_BUILDING_DATA:
      return updateBuilding(state, action.payload as BuildingFormFields)
    case types.SET_NAME:
      return { ...state, name: action.payload }
    case types.SET_DESCRIPTION:
      return { ...state, description: action.payload }
    case types.SET_ADDRESS:
      return { ...state, address: action.payload }
    case types.SET_CITY:
      return { ...state, city: action.payload }
    case types.SET_POSTCODE:
      return { ...state, postCode: action.payload }
    case types.SET_COUNTRY:
      return { ...state, country: action.payload }
    case types.SET_LOCATION:
      return { ...state, location: action.payload }
    case types.SET_LATLNG:
      return { ...state, latLng: action.payload }
    case types.SET_AMENITIES:
      return { ...state, amenities: action.payload }
    case types.SET_DEFAULT_AMENITIES:
      return { ...state, defaultAmenities: action.payload }
    case types.SET_ASPECTS:
      return {
        ...state,
        amenities: aspects2Amenities(state.amenities, action.payload),
      }
    case types.SET_BUILDING_ID:
      return { ...state, buildingId: action.payload }
    case types.SET_IS_PUBLISHING:
      return { ...state, isPublishing: action.payload }
    case types.ADD_NEW_SPACE:
      return newSpace(state, null)
    case types.CLONE_SPACE:
      return newSpace(state, action.payload)
    case types.REMOVE_SPACE:
      return deleteSpace(state, action.payload)
    case types.SET_ERROR:
      return { ...state, error: action.payload }
    case types.EDIT_BUILDING:
      return loadOnboardingSpace(state.defaultAmenities, action.payload, true)
    case types.EDIT_SPACE:
      return loadOnboardingSpace(state.defaultAmenities, action.payload, false)
    default:
      return spaceReducer(state, action)
  }
}

export default reducer
