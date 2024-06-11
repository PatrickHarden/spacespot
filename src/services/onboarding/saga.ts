import { get } from 'lodash'
import { call, put, all, takeLatest, select } from 'redux-saga/effects'
import moment from 'moment'

import {
  getRegionCurrencyCode,
  getGLRegionSizeUnit,
  getRegion,
} from 'services/global/region'
import { DropItem } from 'components/OnBoarding/DropZone'

import constants from './constants'
import actions from './actions'
import userSelectors from '../user/selectors'
import selectors from './selectors'
import {
  OnBoardingAction,
  OnBoardingState,
  BuildingDTO,
  BuildingDetails,
  SpaceDTO,
  SpaceDetails,
  PropertyDocuments,
  ImageResources,
  FlexLeaseDetails,
  FixedLeaseDetails,
  AvailabilityType,
  SpaceLicense,
  AmenityOptions,
  SpaceStatus,
  AvailableSpace,
} from './types'

import {
  getBuildingId,
  getSpaceId,
  createBuilding,
  updateBuilding,
  createSpace,
  updateSpace,
  putDocument,
  deleteSpace,
  deleteBuilding,
} from './api'

import { getAmenities, AmenityData } from 'services/config/api'

import {
  CommonPhotos1,
  CommonImage,
  CommonBrochures1,
  CommonResourceForCultureType,
} from 'services/space/PropertyListingschema'

import dashboardActions from 'services/dashboard/actions'
import toaster from 'services/toaster/actions'

import CONFIG from 'config'
import { getUserIntl, getUserLanguage, getUserLocale } from 'intl'

export const createResourcesImagesFromAPI = (
  items: CommonPhotos1 | undefined,
): Array<ImageResources> =>
  items && items.length > 0
    ? items.map((item: CommonImage) => {
        return {
          caption: get(item, 'Common.ImageCaption'),
          resource: [
            {
              width: get(
                item,
                "['Common.ImageResources'][0]['Common.Image.Width']",
              ) as number,
              height: get(
                item,
                "['Common.ImageResources'][0]['Common.Image.Height']",
              ) as number,
              uri: get(
                item,
                "['Common.ImageResources'][0]['Source.Uri']",
                CONFIG.GL_PHOTO_HOST +
                  get(
                    item,
                    "['Common.ImageResources'][0]['Common.Resource.Uri']",
                  ),
              ) as string,
            },
          ],
        }
      })
    : []
export const createResourcesDocsFromAPI = (
  items: CommonBrochures1 | undefined,
): Array<ImageResources> =>
  items && items.length > 0
    ? items.map((item: CommonResourceForCultureType) => ({
        resource: [
          {
            uri: get(item, 'Common.Uri'),
            uriExternal: get(item, 'Common.UriExternal'),
            cultureCode: get(item, 'Common.CultureCode'),
          },
        ],
      }))
    : []

export const createResources = (
  imageURLs: Array<string>,
  items: Array<DropItem>,
  isImage: boolean,
): Array<ImageResources> => {
  return items && items.length > 0
    ? items
        .map((item: DropItem, index: number) => {
          if (isImage) {
            const i = new Image()
            i.src = item.uri
            return {
              caption: item.name,
              resource: [
                {
                  width: i.width,
                  height: i.height,
                  uri: imageURLs[index],
                },
              ],
            }
          } else {
            return {
              resource: [
                {
                  uriExternal: true,
                  uri: imageURLs[index],
                  cultureCode: getUserLanguage(),
                },
              ],
            }
          }
        })
        .filter(item => get(item, 'resource[0].uri', null) !== null)
    : []
}

export const getBuildingDetails = (
  state: OnBoardingState,
): BuildingDetails => ({
  name: get(state, 'name'),
  address: get(state, 'address'),
  city: get(state, 'city'),
  buildingDescription: get(state, 'description'),
  locationDescription: get(state, 'location'),
  postCode: get(state, 'postCode'),
  latitude: get(state, 'latLng.lat', 0).toString(),
  longitude: get(state, 'latLng.lng', 0).toString(),
  district: get(state, 'district'),
  subdistrict: get(state, 'subdistrict'),
})

export const createBuildingDTO = (
  buildingId: string,
  docs: PropertyDocuments,
  state: OnBoardingState,
): BuildingDTO => ({
  id: buildingId,
  country: get(state, 'country', 'NO'),
  culture: getUserLanguage(),
  propertyDocuments: docs,
  amenities: Object.keys(state.amenities).filter(
    (amenity: string) => state.amenities[amenity].checked,
  ),
  buildingDetails: getBuildingDetails(state),
})

export const createSpaceDTO = (
  buildingId: string,
  id: string,
  docs: PropertyDocuments,
  amenities: Array<string>,
  buildingDetails: BuildingDetails,
  spaceDetails: SpaceDetails,
  country: string,
): SpaceDTO => ({
  id,
  country,
  culture: getUserLanguage(),
  propertyDocuments: docs,
  amenities,
  buildingId,
  buildingDetails,
  details: spaceDetails,
})

const licenceTypes: { [key: string]: SpaceLicense } = {
  OFFICE: 'OfficeLand',
  RETAIL: 'RetailLand',
  OFFICE_RETAIL: 'OfficeRetail',
}

const formatDate = (date: Date) => moment(date).format('YYYY-MM-DD')

export const getFixedDetails = (
  state: OnBoardingState,
  id: string,
): FixedLeaseDetails => ({
  exclusiveSize: {
    value: state.spaces[id].spaceSize || 0,
    unit: getGLRegionSizeUnit(state.country),
  },
  commonArea: {
    value: state.spaces[id].spaceSizeCommon || 0,
    unit: getGLRegionSizeUnit(state.country),
  },
  floor: state.spaces[id].spaceFloor || 0,
  charges: [
    {
      type: 'Rent',
      value: state.spaces[id].spaceRent || 0,
      currencyCode: getRegionCurrencyCode(state.country),
      interval: 'Monthly',
      negotiable: true,
      unit: 'Whole',
    },
    {
      type: 'ServiceCharge',
      value: state.spaces[id].spaceServices || 0,
      currencyCode: getRegionCurrencyCode(state.country),
      interval: 'Monthly',
      negotiable: !state.spaces[id].spaceServicesNotNegotiable,
      unit: 'Whole',
    },
  ],
  propertyType: licenceTypes[state.spaces[id].use],
  availableFrom: formatDate(state.spaces[id].availabilityFixed),
  minLease: state.spaces[id].months || 0,
  fitOutOptions: state.spaces[id].fitout.map(fitout => ({
    name: fitout.name,
    description: fitout.description,
    identifier: 'fitout',
    charges: {
      type: 'PropertyAccommodation',
      value: fitout.amount,
      currencyCode: getRegionCurrencyCode(state.country),
      interval: 'Monthly',
      negotiable: false,
      onApplication: true,
    },
  })),
})

export const getFlexDetails = (
  state: OnBoardingState,
  id: string,
): FlexLeaseDetails => {
  // map AvailabilityFlex to AvailableSpace
  const offices = state.spaces[id].servicedOffices
  const hotDesks = state.spaces[id].hotDesks
  const fixedDesks = state.spaces[id].fixedDesks
  let maxOfficeId = offices
    ? offices.reduce((max, office) => {
        return office.id && Number(office.id) > max ? Number(office.id) : max
      }, 0)
    : 0

  const availableItems: Array<AvailableSpace> = offices
    ? offices.map(office => ({
        type: AvailabilityType.ServicedOffice,
        numberOfDesks: office.desks,
        availableFrom: formatDate(office.availableFrom),
        minLease: office.minLease,
        floor: office.floor,
        charges: [
          {
            type: 'Rent',
            value: office.price,
            currencyCode: getRegionCurrencyCode(state.country),
            interval: 'Monthly',
            negotiable: true,
            unit: 'unit',
          },
        ],
        identifier: office.id || (++maxOfficeId).toString(),
      }))
    : []

  if (hotDesks && hotDesks.desks > 0) {
    availableItems.push({
      type: AvailabilityType.HotDesk,
      numberOfDesks: hotDesks.desks,
      availableFrom: formatDate(hotDesks.availableFrom),
      minLease: hotDesks.minLease,
      charges: [
        {
          type: 'Rent',
          value: hotDesks.price,
          currencyCode: getRegionCurrencyCode(state.country),
          interval: 'Monthly',
          negotiable: true,
          unit: 'unit',
        },
      ],
    })
  }
  if (fixedDesks && fixedDesks.desks > 0) {
    availableItems.push({
      type: AvailabilityType.FixedDesk,
      numberOfDesks: fixedDesks.desks,
      availableFrom: formatDate(fixedDesks.availableFrom),
      minLease: fixedDesks.minLease,
      charges: [
        {
          type: 'Rent',
          value: fixedDesks.price,
          currencyCode: getRegionCurrencyCode(state.country),
          interval: 'Monthly',
          negotiable: true,
          unit: 'unit',
        },
      ],
    })
  }

  return {
    availableSpace: availableItems,
  }
}

export const getSpaceDetails = (
  state: OnBoardingState,
  id: string,
): SpaceDetails => {
  const isFlex = state.spaces[id].type === 'FLEX'
  return {
    fixedLease: isFlex ? undefined : getFixedDetails(state, id),
    flexLease: isFlex ? getFlexDetails(state, id) : undefined,
    headline: state.spaces[id].spaceName,
    description: state.spaces[id].spaceDescription,
    spaceHighlights: state.spaces[id].spaceHighlights,
    matterPortUrl: state.spaces[id].spaceMatterPort,
    flooredUrl: state.spaces[id].spaceFloored,
    leaseType: isFlex ? 1 : 0,
  }
}

export function* publishDoc(
  image: DropItem,
  spaceId: string,
  fileCategory: 'pictures' | 'brochures' | 'floorplans',
) {
  try {
    const token: string = yield select(userSelectors.token)
    const url = yield call(putDocument, image, spaceId, token, fileCategory)
    return url
  } catch (e) {
    yield put(actions.setError(e))
    return null
  }
}

export function* publishSpace(
  state: OnBoardingState,
  buildingId: string,
  key: string,
) {
  try {
    const token: string = yield select(userSelectors.token)
    const country = state.country ? state.country : get(state, 'country', 'NO')
    const spaceId = yield call(getSpaceId, token, country)
    const images = state.spaces[key].images
    const imageURLs: Array<string> = yield all(
      images.map((item: any) => call(publishDoc, item, spaceId, 'pictures')),
    )
    const floorPlan = state.spaces[key].floorPlan
    const floorPlanURLs: Array<string> = yield all(
      floorPlan.map((item: any) =>
        call(publishDoc, item, spaceId, 'floorplans'),
      ),
    )
    const pDocs: PropertyDocuments = {
      photos: createResources(imageURLs, images, true),
      brochures: [],
      floorPlans: createResources(floorPlanURLs, floorPlan, true),
    }
    const buildingDetails = getBuildingDetails(state)
    const amenities = Object.keys(state.amenities).filter(
      (amenity: string) => state.amenities[amenity].checked,
    )
    const spaceDetails: SpaceDetails = getSpaceDetails(state, key)
    const spaceDTO = createSpaceDTO(
      buildingId,
      spaceId,
      pDocs,
      amenities,
      buildingDetails,
      spaceDetails,
      get(state, 'country', 'NO'),
    )
    const space = yield call(createSpace, spaceDTO, token)
    // update the space state
    const spaceState =
      imageURLs.some(imageURL => !imageURL) ||
      floorPlanURLs.some(floorPlanURL => !floorPlanURL)
        ? SpaceStatus.PublishedWithErrors
        : SpaceStatus.Published
    yield put(actions.setSpaceStatus(key, spaceState))
    return space
  } catch (e) {
    yield put(actions.setError(e))
    yield put(actions.setSpaceStatus(key, SpaceStatus.ErrorPublishing))
  }
}

export function* publishOnboardingSaga(action: OnBoardingAction) {
  try {
    const { payload } = action
    const state = payload as OnBoardingState
    const country = payload.country
      ? payload.country
      : get(state, 'country', 'NO')
    const token: string = yield select(userSelectors.token)
    const buildingId = state.isNew
      ? yield call(getBuildingId, token, country)
      : state.buildingId

    if (state.isNew) {
      const { images, docs } = state
      const imageURLs: Array<string> = yield all(
        images.map((item: any) =>
          call(publishDoc, item, buildingId, 'pictures'),
        ),
      )
      const docURLs: Array<string> = yield all(
        docs.map((item: any) =>
          call(publishDoc, item, buildingId, 'brochures'),
        ),
      )
      const pDocs: PropertyDocuments = {
        photos: createResources(imageURLs, images, true),
        brochures: createResources(docURLs, docs, false),
        floorPlans: [],
      }
      const building = createBuildingDTO(buildingId, pDocs, state)
      yield call(createBuilding, building, token)
      // update the building state
      yield put(actions.setIsNew(false))
      yield put(actions.setBuildingId(buildingId))
    }

    const res = yield all(
      Object.keys(state.spaces)
        .filter(key => state.spaces[key].status === SpaceStatus.ReadyForPublish)
        .map(key => call(publishSpace, state, buildingId, key)),
    )
    return res
  } catch (e) {
    yield put(actions.setError(e))
    yield put(actions.setIsPublishing(false))
    yield put(
      toaster.showError(
        getUserIntl().formatMessage({ id: 'ERROR_PUBLISH_BUILDING' }),
      ),
    )
  }
}

export function* updateBuildingSaga() {
  try {
    yield put(actions.setIsPublishing(true))
    const state: OnBoardingState = yield select(selectors.onboardingState)
    const token: string = yield select(userSelectors.token)
    if (!state.buildingId) {
      throw new Error('No building')
    }
    const buildingId = state.buildingId

    const { images, docs } = state
    const imageURLs: Array<string> = yield all(
      images.map((item: any) => call(publishDoc, item, buildingId, 'pictures')),
    )
    const docURLs: Array<string> = yield all(
      docs.map((item: any) => call(publishDoc, item, buildingId, 'brochures')),
    )
    const pDocs: PropertyDocuments = {
      photos: [
        ...createResourcesImagesFromAPI(state.uploadedImages),
        ...createResources(imageURLs, images, true),
      ],
      brochures: [
        ...createResourcesDocsFromAPI(state.uploadedDocs),
        ...createResources(docURLs, docs, false),
      ],
      floorPlans: [],
    }
    const building = createBuildingDTO(buildingId, pDocs, state)
    yield call(updateBuilding, building, token)
    yield put(actions.setIsPublishing(false))

    return building
  } catch (e) {
    yield put(actions.setError(e.message))
    yield put(actions.setIsPublishing(false))
    yield put(
      toaster.showError(
        getUserIntl().formatMessage({ id: 'ERROR_PUBLISH_BUILDING' }),
      ),
    )
  }
}

export function* updateSpaceSaga() {
  let key
  try {
    const state: OnBoardingState = yield select(selectors.onboardingState)
    if (!state || !state.buildingId) {
      throw new Error('No building')
    }
    key = Object.keys(state.spaces)[0]
    const spaceId = state.spaces[key].id
    const token: string = yield select(userSelectors.token)
    const images = state.spaces[key].images
    const imageURLs: Array<string> = yield all(
      images.map((item: any) => call(publishDoc, item, spaceId, 'pictures')),
    )
    const floorPlan = state.spaces[key].floorPlan
    const floorPlanURLs: Array<string> = yield all(
      floorPlan.map((item: any) =>
        call(publishDoc, item, spaceId, 'floorplans'),
      ),
    )
    const pDocs: PropertyDocuments = {
      photos: [
        ...createResources(imageURLs, images, true),
        ...createResourcesImagesFromAPI(state.spaces[key].uploadedImages),
      ],
      brochures: [],
      floorPlans: [
        ...createResources(floorPlanURLs, floorPlan, true),
        ...createResourcesImagesFromAPI(state.spaces[key].uploadedFloorPlans),
      ],
    }
    const buildingDetails = getBuildingDetails(state)
    const amenities = Object.keys(state.amenities).filter(
      (amenity: string) => state.amenities[amenity].checked,
    )
    const spaceDetails: SpaceDetails = getSpaceDetails(state, key)
    const spaceDTO = createSpaceDTO(
      state.buildingId,
      spaceId,
      pDocs,
      amenities,
      buildingDetails,
      spaceDetails,
      get(state, 'country', 'NO'),
    )
    const space = yield call(updateSpace, spaceId, spaceDTO, token)
    const spaceState =
      imageURLs.some(imageURL => !imageURL) ||
      floorPlanURLs.some(floorPlanURL => !floorPlanURL)
        ? SpaceStatus.PublishedWithErrors
        : SpaceStatus.Published
    yield put(actions.setSpaceStatus(key, spaceState))
    return space
  } catch (e) {
    yield put(actions.setError(e.message))
    if (key) {
      yield put(actions.setSpaceStatus(key, SpaceStatus.ErrorPublishing))
    }
  }
}

export function* addSpaceSaga() {
  try {
    const state: OnBoardingState = yield select(selectors.onboardingState)
    const key = state.spaceCount.toString()
    yield put(actions.addNewSpace())
    yield put(actions.goToSpace(key))
    return key
  } catch (e) {
    yield put(actions.setError(e.message))
  }
}

export function* deleteSpaceSaga(action: any) {
  const { payload } = action
  const id = payload as string
  const intl = getUserIntl()
  try {
    const token: string = yield select(userSelectors.token)
    const resp = yield call(deleteSpace, id, token)
    yield put(dashboardActions.pendingSpaceDelete(id))
    yield put(
      toaster.showSuccess(intl.formatMessage({ id: 'SUCCESS_DELETE_SPACE' })),
    )
    return resp
  } catch (e) {
    yield put(actions.setError(e.message))
    yield put(
      toaster.showError(intl.formatMessage({ id: 'ERROR_DELETE_SPACE' })),
    )
  }
}

export function* deleteBuildingSaga(action: any) {
  const { payload } = action
  const id = payload as string
  const intl = getUserIntl()
  try {
    const token: string = yield select(userSelectors.token)
    const resp = yield call(deleteBuilding, id, token)
    yield put(dashboardActions.pendingSpaceDelete(id))
    yield put(
      toaster.showSuccess(
        intl.formatMessage({ id: 'SUCCESS_DELETE_BUILDING' }),
      ),
    )
    return resp
  } catch (e) {
    yield put(actions.setError(e.message))
    yield put(
      toaster.showError(intl.formatMessage({ id: 'ERROR_DELETE_BUILDING' })),
    )
  }
}

export function* initAmenitiesSaga() {
  try {
    const lang = getUserLocale()
    const region = getRegion()
    const resp: Array<AmenityData> = yield call(getAmenities, region, lang)
    const amenityOptions = resp.reduce((obj: AmenityOptions, item) => {
      obj[item.name] = { desc: item.description, checked: false }
      return obj
    }, {})
    yield put(actions.setDefaultAmenities(amenityOptions))
    return amenityOptions
  } catch (e) {
    yield put(actions.setError(e.message))
  }
}

function* saga() {
  yield takeLatest(constants.INIT_DEFAULT_AMENITIES, initAmenitiesSaga)
  yield takeLatest(constants.INIT, publishOnboardingSaga)
  yield takeLatest(constants.UPDATE_BUILDING, updateBuildingSaga)
  yield takeLatest(constants.UPDATE_SPACE, updateSpaceSaga)
  yield takeLatest(constants.ADD_NEW_SPACE_GO, addSpaceSaga)
  yield takeLatest(constants.DELETE_SPACE, deleteSpaceSaga)
  yield takeLatest(constants.DELETE_BUILDING, deleteBuildingSaga)
}

export default saga
