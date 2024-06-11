import { getAmenities, AmenityData } from 'services/config/api'
import { all, call, put, select } from 'redux-saga/effects'
import userSelectors from 'services/user/selectors'
import { createOnBoardingState } from 'components/OnBoarding/helpers'
import { CommonImage } from 'services/space/PropertyListingschema'
import { getRegion } from 'services/global/region'
import {
  publishOnboardingSaga,
  publishDoc,
  publishSpace,
  createResources,
  createBuildingDTO,
  getBuildingDetails,
  getSpaceDetails,
  createSpaceDTO,
  getFixedDetails,
  getFlexDetails,
  createResourcesImagesFromAPI,
  updateBuildingSaga,
  updateSpaceSaga,
  addSpaceSaga,
  initAmenitiesSaga,
} from '../saga'
import {
  getBuildingId,
  getSpaceId,
  createSpace,
  createBuilding,
  putDocument,
  updateSpace,
} from '../api'
import actions from '../actions'
import selectors from '../selectors'
import { AmenityOptions, SpaceStatus } from '../types'

type Saga = Generator<void, any, any>

describe('Onboarding', () => {
  it('saga should ', async () => {
    const images = [{ uri: '.', name: 'img1', key: 12, type: 'image/png' }]
    const docs = [{ uri: '.', name: 'doc1', key: 12, type: 'application/pdf' }]
    const token = 'dummy'
    const state = createOnBoardingState()
    state.images = images
    state.docs = docs
    const pDocs = {
      photos: createResources([], state.images, true),
      brochures: createResources([], state.docs, false),
      floorPlans: [],
    }
    const building = createBuildingDTO('id1', pDocs, state)
    const gen = publishOnboardingSaga(actions.init(state)) as Saga
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(getBuildingId, token))
    expect(gen.next('id1').value).toEqual(
      all(images.map(i => call(publishDoc, i, 'id1', 'pictures'))),
    )
    expect(gen.next([]).value).toEqual(
      all(docs.map(i => call(publishDoc, i, 'id1', 'brochures'))),
    )
    expect(gen.next([]).value).toEqual(call(createBuilding, building, token))
    expect(gen.next().value).toEqual(put(actions.setIsNew(false)))
    expect(gen.next().value).toEqual(put(actions.setBuildingId('id1')))
    expect(gen.next().value).toEqual(
      all(
        Object.keys(state.spaces)
          .filter(
            key => state.spaces[key].status === SpaceStatus.ReadyForPublish,
          )
          .map(key => call(publishSpace, state, 'id1', key)),
      ),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('building saga should fail', async () => {
    const state = createOnBoardingState()
    const gen = publishOnboardingSaga(actions.init(state)) as Saga
    expect(gen.next().value).toEqual(select(userSelectors.token))
    gen.throw(new Error('Error1'))
  })

  it('space saga', async () => {
    const token = 'dummy'
    const images = [{ uri: '.', name: 'img1', key: 12, type: 'image/png' }]
    const plans = [{ uri: '.', name: 'img1', key: 12, type: 'image/png' }]
    const state = createOnBoardingState()
    state.spaces[0].images = images
    state.spaces[0].floorPlan = plans
    const gen = publishSpace(state, 'bid1', '0') as Saga
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(call(getSpaceId, token))
    expect(gen.next('id1').value).toEqual(
      all(images.map((i: any) => call(publishDoc, i, 'id1', 'pictures'))),
    )
    expect(gen.next([]).value).toEqual(
      all(plans.map((i: any) => call(publishDoc, i, 'id1', 'floorplans'))),
    )
    const pDocs = {
      photos: createResources([], images, true),
      brochures: [],
      floorPlans: createResources([], plans, true),
    }
    const buildingDetails = getBuildingDetails(state)
    const amenities = ['hasGym']
    const spaceDetails = getSpaceDetails(state, '0')
    const spaceDTO = createSpaceDTO(
      'bid1',
      'id1',
      pDocs,
      amenities,
      buildingDetails,
      spaceDetails,
      '',
    )
    expect(gen.next([]).value).toEqual(call(createSpace, spaceDTO, token))
    expect(gen.next().value).toEqual(
      put(actions.setSpaceStatus('0', SpaceStatus.Published)),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('space saga should fail', async () => {
    const state = createOnBoardingState()
    const gen = publishSpace(state, 'id1', '0') as Saga
    expect(gen.next().value).toEqual(select(userSelectors.token))
    gen.throw(new Error('Error1'))
  })

  it('doc saga', async () => {
    const token = 'dummy'
    const image = { uri: '.', name: 'img1', key: 12, type: 'image/png' }
    const gen = publishDoc(image, 'id1', 'pictures') as Saga
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(putDocument, image, 'id1', token, 'pictures'),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('doc saga should fail', async () => {
    const image = { uri: '.', name: 'img1', key: 12, type: 'image/png' }
    const gen = publishDoc(image, 'id1', 'pictures') as Saga
    expect(gen.next().value).toEqual(select(userSelectors.token))
    gen.throw(new Error('Error1'))
  })

  it('helpers', async () => {
    const state = createOnBoardingState()
    expect(getFixedDetails(state, '0')).toMatchSnapshot()
    expect(getFlexDetails(state, '0')).toMatchSnapshot()
    expect(createResources([], state.images, true)).toMatchSnapshot()
    expect(createResources([], state.images, false)).toMatchSnapshot()

    const img: CommonImage = {
      'Common.ImageResources': [
        {
          'Common.Image.Width': 100,
          'Common.Image.Height': 100,
          'Common.Resource.Uri': 'https://www.spacespot.com',
        },
      ],
    }
    const items: Array<CommonImage> = [img, img, img]
    const rsrcs = createResourcesImagesFromAPI(items)
    expect(rsrcs).toMatchSnapshot()
  })

  it('update building', async () => {
    const token = 'dummy'
    const image = { uri: '.', name: 'img1', key: 12, type: 'image/png' }
    const images = [image]
    const docs = [image]
    const state = createOnBoardingState()
    state.images = images
    state.docs = docs
    state.buildingId = 'id1'
    const gen = updateBuildingSaga() as Saga
    expect(gen.next().value).toEqual(put(actions.setIsPublishing(true)))
    expect(gen.next().value).toEqual(select(selectors.onboardingState))
    expect(gen.next(state).value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      all(images.map((i: any) => call(publishDoc, i, 'id1', 'pictures'))),
    )
    expect(gen.next([]).value).toEqual(
      all(docs.map((i: any) => call(publishDoc, i, 'id1', 'brochures'))),
    )
    expect(gen.next([]).value).toEqual(
      jasmine.objectContaining({
        type: 'CALL',
        payload: jasmine.any(Object),
      }),
    )
    expect(gen.next().value).toEqual(put(actions.setIsPublishing(false)))
    expect(gen.next().done).toEqual(true)
  })

  it('update building should fail without building', async () => {
    const gen = updateBuildingSaga() as Saga
    expect(gen.next().value).toEqual(put(actions.setIsPublishing(true)))
    expect(gen.next().value).toEqual(select(selectors.onboardingState))
    expect(gen.next({}).value).toEqual(select(userSelectors.token))
    expect(gen.next().value).toEqual(
      put(actions.setError((jasmine.any(String) as unknown) as string)),
    )
  })

  it('update building should fail', async () => {
    const gen = updateBuildingSaga() as Saga
    expect(gen.next().value).toEqual(put(actions.setIsPublishing(true)))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.setError('Error1')),
    )
  })

  it('update space', async () => {
    const gen = updateSpaceSaga() as Saga
    const token = 'dummy'
    const images = [{ uri: '.', name: 'img1', key: 12, type: 'image/png' }]
    const plans = [{ uri: '.', name: 'img1', key: 12, type: 'image/png' }]
    const state = createOnBoardingState()
    state.buildingId = 'bid1'
    state.spaces[0].images = images
    state.spaces[0].floorPlan = plans
    expect(gen.next().value).toEqual(select(selectors.onboardingState))
    expect(gen.next(state).value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      all(images.map((i: any) => call(publishDoc, i, '0', 'pictures'))),
    )
    expect(gen.next([]).value).toEqual(
      all(plans.map((i: any) => call(publishDoc, i, '0', 'floorplans'))),
    )
    const pDocs = {
      photos: createResources([], images, true),
      brochures: [],
      floorPlans: createResources([], plans, true),
    }
    const buildingDetails = getBuildingDetails(state)
    const amenities = ['hasGym']
    const spaceDetails = getSpaceDetails(state, '0')
    const spaceDTO = createSpaceDTO(
      'bid1',
      '0',
      pDocs,
      amenities,
      buildingDetails,
      spaceDetails,
      '',
    )
    expect(gen.next([]).value).toEqual(call(updateSpace, '0', spaceDTO, token))
    expect(gen.next().value).toEqual(
      put(actions.setSpaceStatus('0', SpaceStatus.Published)),
    )

    expect(gen.next().done).toEqual(true)
  })

  it('update space should fail without building', async () => {
    const gen = updateSpaceSaga() as Saga
    expect(gen.next().value).toEqual(select(selectors.onboardingState))
    expect(gen.next().value).toEqual(
      put(actions.setError((jasmine.any(String) as unknown) as string)),
    )
  })

  it('update space should fail', async () => {
    const gen = updateSpaceSaga() as Saga
    expect(gen.next().value).toEqual(select(selectors.onboardingState))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.setError('Error1')),
    )
  })

  it('addSpaceSaga saga', async () => {
    const gen = addSpaceSaga() as Saga
    const state = { spaceCount: 0 }
    expect(gen.next().value).toEqual(select(selectors.onboardingState))
    expect(gen.next(state).value).toEqual(put(actions.addNewSpace()))
    expect(gen.next(state).value).toEqual(put(actions.goToSpace('0')))
    expect(gen.next().done).toEqual(true)
  })

  it('addSpaceSaga saga fails', async () => {
    const gen = addSpaceSaga() as Saga
    expect(gen.next().value).toEqual(select(selectors.onboardingState))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.setError('Error1')),
    )
  })

  it('initAmenities saga', async () => {
    const gen = initAmenitiesSaga() as Saga
    const lang = navigator.language
    const region = getRegion()
    const data: Array<AmenityData> = [{ name: 'test', description: 'test' }]
    const amenities: AmenityOptions = {
      test: {
        checked: false,
        desc: 'test',
      },
    }
    expect(gen.next().value).toEqual(call(getAmenities, region, lang))
    expect(gen.next(data).value).toEqual(
      put(actions.setDefaultAmenities(amenities)),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('initAmenities saga error', async () => {
    const gen = initAmenitiesSaga() as Saga
    expect(gen.next().value).toEqual(
      call(getAmenities, getRegion(), navigator.language),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.setError('Error1')),
    )
  })
})
