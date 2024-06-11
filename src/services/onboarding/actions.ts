import types from 'services/onboarding/constants'
import history from 'browserhistory'
import { DropItem } from 'components/OnBoarding/DropZone'
import { FitoutOptionProps } from 'services/negotiation/types'
import {
  CommonPhotos1,
  CommonBrochures1,
} from 'services/space/PropertyListingschema'
import { Space } from 'services/space/types'

import {
  OnBoardingAction,
  OnBoardingState,
  AvailabilityFlex,
  AmenityOptions,
  SpaceStatus,
} from 'services/onboarding/types'
import { BuildingFormFields } from 'components/OnBoarding/BuildingDetailsForm'

const clear = () => ({ type: types.CLEAR })

const init = (payload: OnBoardingState): OnBoardingAction => ({
  type: types.INIT,
  payload,
})

const initSuccess = (payload: any): any => ({
  type: types.INIT_SUCCESS,
  payload,
})

const initError = (payload: string): any => ({
  type: types.INIT_ERROR,
  payload,
})

const goToBuilding = () => {
  history.push('/onboarding/')
  return {
    type: types.NOP,
  }
}

const goToSpace = (id: string) => {
  history.push(`/onboarding/space/${id}`)
  return {
    type: types.NOP,
  }
}

const goToPublish = () => {
  history.push('/onboarding/publish')
  return {
    type: types.NOP,
  }
}

const resetSpaces = () => ({
  type: types.RESET_SPACES,
})

const addNewSpace = () => ({
  type: types.ADD_NEW_SPACE,
})

const addNewSpaceAndGo = () => ({
  type: types.ADD_NEW_SPACE_GO,
})

const cloneSpace = (payload: string) => ({
  type: types.CLONE_SPACE,
  payload,
})

const removeSpace = (payload: string) => ({
  type: types.REMOVE_SPACE,
  payload,
})

const setIsNew = (payload: boolean) => ({
  type: types.SET_IS_NEW,
  payload,
})

const setImages = (payload: Array<DropItem>) => ({
  type: types.SET_IMAGES,
  payload,
})

const setUploadedImages = (payload: CommonPhotos1) => ({
  type: types.SET_UPLOADED_IMAGES,
  payload,
})

const setSpaceUploadedImages = (id: string, value: CommonPhotos1) => ({
  type: types.SET_SPACE_UPLOADED_IMAGES,
  payload: { id, value },
})

const setDocs = (payload: Array<DropItem>) => ({
  type: types.SET_DOCS,
  payload,
})

const setUploadedDocs = (payload: CommonBrochures1) => ({
  type: types.SET_UPLOADED_DOCS,
  payload,
})

const setSpaceUploadedFloorPlans = (id: string, value: CommonPhotos1) => ({
  type: types.SET_SPACE_UPLOADED_FLOORPLANS,
  payload: { id, value },
})

const setName = (payload: string) => ({
  type: types.SET_NAME,
  payload,
})

const setBuildingData = (payload: BuildingFormFields) => ({
  type: types.SET_BUILDING_DATA,
  payload,
})

const setDescription = (payload: string) => ({
  type: types.SET_DESCRIPTION,
  payload,
})

const setAddress = (payload: string) => ({
  type: types.SET_ADDRESS,
  payload,
})

const setCity = (payload: string) => ({
  type: types.SET_CITY,
  payload,
})

const setPostCode = (payload: string) => ({
  type: types.SET_POSTCODE,
  payload,
})

const setCountry = (payload: string) => ({
  type: types.SET_COUNTRY,
  payload,
})

const setLocation = (payload: string) => ({
  type: types.SET_LOCATION,
  payload,
})

const setLatLng = (payload: { lat: number; lng: number } | undefined) => ({
  type: types.SET_LATLNG,
  payload,
})

const setAmenities = (payload: AmenityOptions) => ({
  type: types.SET_AMENITIES,
  payload,
})

const initDefaultAmenities = () => ({
  type: types.INIT_DEFAULT_AMENITIES,
})

const setDefaultAmenities = (payload: AmenityOptions) => ({
  type: types.SET_DEFAULT_AMENITIES,
  payload,
})

const setAspects = (payload: Array<string>) => ({
  type: types.SET_ASPECTS,
  payload,
})

const setBuildingId = (payload: string) => ({
  type: types.SET_BUILDING_ID,
  payload,
})

const setIsPublishing = (payload: boolean) => ({
  type: types.SET_IS_PUBLISHING,
  payload,
})

const setError = (payload: string) => ({
  type: types.SET_ERROR,
  payload,
})

const updateBuilding = () => ({
  type: types.UPDATE_BUILDING,
})

/* Space actions */
const setSpaceType = (id: string, value: string) => ({
  type: types.SET_SPACE_TYPE,
  payload: { id, value },
})

const setSpaceName = (id: string, value: string) => ({
  type: types.SET_SPACE_NAME,
  payload: { id, value },
})

const setSpaceDescription = (id: string, value: string) => ({
  type: types.SET_SPACE_DESCRIPTION,
  payload: { id, value },
})

const setSpaceHighlights = (id: string, value: string) => ({
  type: types.SET_SPACE_HIGHLIGHTS,
  payload: { id, value },
})

const setSpaceSize = (id: string, value: number) => ({
  type: types.SET_SPACE_SIZE,
  payload: { id, value },
})

const setSpaceSizeCommon = (id: string, value: number) => ({
  type: types.SET_SPACE_SIZE_COMMON,
  payload: { id, value },
})

const setSpaceFloor = (id: string, value: number) => ({
  type: types.SET_SPACE_FLOOR,
  payload: { id, value },
})

const setSpaceMatterPort = (id: string, value: string) => ({
  type: types.SET_SPACE_MATTER_PORT,
  payload: { id, value },
})

const setSpaceFloored = (id: string, value: string) => ({
  type: types.SET_SPACE_FLOORED,
  payload: { id, value },
})

const setSpaceUse = (id: string, value: string) => ({
  type: types.SET_SPACE_USE,
  payload: { id, value },
})

const setSpaceRent = (id: string, value: number) => ({
  type: types.SET_SPACE_RENT,
  payload: { id, value },
})

const setSpaceServices = (id: string, value: number) => ({
  type: types.SET_SPACE_SERVICES,
  payload: { id, value },
})

const setSpaceServicesNotNegotiable = (id: string, value: boolean) => ({
  type: types.SET_SPACE_SERVICES_NOT_NEGOTIABLE,
  payload: { id, value },
})

const setSpaceAvailabilityFixed = (id: string, value: Date) => ({
  type: types.SET_SPACE_AVAILABILITY_FIXED,
  payload: { id, value },
})

const setSpaceMonths = (id: string, value: number) => ({
  type: types.SET_SPACE_MONTHS,
  payload: { id, value },
})

const setSpaceHotDesks = (id: string, value: AvailabilityFlex) => ({
  type: types.SET_SPACE_HOT_DESKS,
  payload: { id, value },
})

const setSpaceFixedDesks = (id: string, value: AvailabilityFlex) => ({
  type: types.SET_SPACE_FIXED_DESKS,
  payload: { id, value },
})

const setSpaceServicedOffices = (
  id: string,
  value: Array<AvailabilityFlex>,
) => ({
  type: types.SET_SPACE_SERVICED_OFFICES,
  payload: { id, value },
})

const setSpaceImages = (id: string, value: Array<DropItem>) => ({
  type: types.SET_SPACE_IMAGES,
  payload: { id, value },
})

const setSpaceFloorPlan = (id: string, value: Array<DropItem>) => ({
  type: types.SET_SPACE_FLOORPLAN,
  payload: { id, value },
})

const setSpaceFitout = (id: string, value: Array<FitoutOptionProps>) => ({
  type: types.SET_SPACE_FITOUT,
  payload: { id, value },
})

const setSpaceStatus = (id: string, value: SpaceStatus) => ({
  type: types.SET_SPACE_STATUS,
  payload: { id, value },
})

const updateSpace = () => ({
  type: types.UPDATE_SPACE,
})

const deleteSpace = (id: string) => ({
  type: types.DELETE_SPACE,
  payload: id,
})

const deleteBuilding = (id: string) => ({
  type: types.DELETE_BUILDING,
  payload: id,
})

const onboardingEditBuilding = (payload: Space) => ({
  type: types.EDIT_BUILDING,
  payload,
})

const onboardingEditSpace = (payload: Space) => ({
  type: types.EDIT_SPACE,
  payload,
})

export default {
  clear,
  init,
  initSuccess,
  initError,
  goToBuilding,
  goToSpace,
  goToPublish,
  addNewSpace,
  addNewSpaceAndGo,
  cloneSpace,
  deleteSpace,
  deleteBuilding,
  removeSpace,
  setIsNew,
  setImages,
  setUploadedImages,
  setSpaceUploadedImages,
  setDocs,
  setUploadedDocs,
  setSpaceUploadedFloorPlans,
  setBuildingData,
  setName,
  setDescription,
  setAddress,
  setCity,
  setPostCode,
  setCountry,
  setLocation,
  setLatLng,
  setAmenities,
  initDefaultAmenities,
  setDefaultAmenities,
  setAspects,
  setBuildingId,
  setIsPublishing,
  setError,
  setSpaceType,
  setSpaceName,
  setSpaceDescription,
  setSpaceHighlights,
  setSpaceSize,
  setSpaceSizeCommon,
  setSpaceFloor,
  setSpaceMatterPort,
  setSpaceFloored,
  setSpaceUse,
  setSpaceRent,
  setSpaceServices,
  setSpaceServicesNotNegotiable,
  setSpaceAvailabilityFixed,
  setSpaceMonths,
  setSpaceHotDesks,
  setSpaceFixedDesks,
  setSpaceServicedOffices,
  setSpaceImages,
  setSpaceFloorPlan,
  setSpaceFitout,
  setSpaceStatus,
  updateBuilding,
  updateSpace,
  resetSpaces,
  onboardingEditBuilding,
  onboardingEditSpace,
}
