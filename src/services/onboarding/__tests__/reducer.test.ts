import reducer from '../reducer'
import actions from '../actions'
import {
  OnBoardingState,
  AvailabilityFlex,
  SpaceStatus,
  AmenityOptions,
} from '../types'
import { Space } from '../../space/types'
import DashboardBuildingSpace from '../../space/__mocks__/dashboard-building-space.json'

let state: OnBoardingState
const mockDate = new Date('2020-01-01')
const amenities: AmenityOptions = {
  hasLifter: { desc: 'Lifert', checked: false },
  hasSecurity: { desc: 'Security', checked: false },
}
let unk: unknown

const availability: AvailabilityFlex = {
  desks: 20,
  availableFrom: mockDate,
  minLease: 2,
  price: 2000,
}

describe('Onboarding reducer', () => {
  it('should return the initial state', () => {
    state = reducer(state, actions.setName('name1'))
    state.spaces[0].availabilityFixed = mockDate
    state.spaces[0].fixedDesks.availableFrom = mockDate
    state.spaces[0].hotDesks.availableFrom = mockDate
    state.spaces[0].servicedOffices.availableFrom = mockDate
    expect(state).toMatchSnapshot()
    state = reducer(state, actions.setDescription('desc1'))
    expect(state).toMatchSnapshot()
    state = reducer(state, actions.setAddress('addres1'))
    state = reducer(state, actions.setAmenities(unk as AmenityOptions))
    state = reducer(state, actions.setAmenities(amenities))
    state = reducer(state, actions.setAspects(unk as Array<string>))
    state = reducer(state, actions.setAspects(['hasLifter']))
    state = reducer(state, actions.setAspects(['none']))
    state = reducer(state, actions.setBuildingId('id1'))
    state = reducer(state, actions.setCity('Olso'))
    state = reducer(state, actions.setPostCode('Olso'))
    state = reducer(state, actions.setLocation('Olso'))
    state = reducer(state, actions.setDescription('descr1'))
    state = reducer(state, actions.setIsNew(true))
    state = reducer(state, actions.setLatLng({ lat: 0, lng: 0 }))
    state = reducer(state, actions.setImages([]))
    state = reducer(state, actions.setDocs([]))
    state = reducer(state, actions.setSpaceDescription('0', 'space1'))
    state = reducer(state, actions.setSpaceFloor('0', 1))
    state = reducer(state, actions.setSpaceFloored('0', 'data'))
    state = reducer(state, actions.setSpaceHighlights('0', 'data'))
    state = reducer(state, actions.setSpaceStatus('0', SpaceStatus.New))
    state = reducer(state, actions.setSpaceMatterPort('0', 'data'))
    state = reducer(state, actions.setSpaceMonths('0', 1))
    state = reducer(state, actions.setSpaceName('0', 'space1'))
    state = reducer(state, actions.setSpaceRent('0', 5000))
    state = reducer(state, actions.setSpaceServices('0', 500))
    state = reducer(state, actions.setSpaceSize('0', 500))
    state = reducer(state, actions.setSpaceSizeCommon('0', 550))
    state = reducer(state, actions.setSpaceType('0', 'FLEX'))
    state = reducer(state, actions.cloneSpace('0'))
    state = reducer(state, actions.setSpaceFitout('0', []))
    state = reducer(state, actions.setSpaceImages('0', []))
    state = reducer(state, actions.setSpaceFloorPlan('0', []))
    state = reducer(state, actions.setSpaceAvailabilityFixed('0', mockDate))
    state = reducer(state, actions.setSpaceFixedDesks('0', availability))
    state = reducer(state, actions.setSpaceServicedOffices('0', availability))
    state = reducer(state, actions.setSpaceHotDesks('0', availability))
    state = reducer(state, actions.setSpaceUse('0', 'OFFICE'))
    state = reducer(state, actions.setSpaceServicesNotNegotiable('0', true))
    state = reducer(state, actions.setIsPublishing(true))
    state = reducer(
      state,
      actions.setDefaultAmenities({
        hasGym: {
          checked: true,
          desc: 'hasGym',
        },
      }),
    )
    state = reducer(state, actions.setCountry('NO'))
    state = reducer(state, actions.setUploadedDocs([]))
    state = reducer(state, actions.setUploadedImages([]))
    state = reducer(state, actions.setSpaceUploadedImages('0', []))
    state = reducer(state, actions.setSpaceUploadedFloorPlans('0', []))
    state = reducer(state, actions.setError('Error1'))
    expect(state).toMatchSnapshot()
    state = reducer(state, actions.resetSpaces())
    state = reducer(state, actions.addNewSpace())
    expect(state).toMatchSnapshot()
    state = reducer(state, actions.removeSpace('0'))
    expect(state).toMatchSnapshot()
  })

  describe('Onboarding reducer with one edit building', () => {
    it('should return the edited building', () => {
      state = reducer(state, actions.clear())
      expect(state).toMatchSnapshot()
      const building: Space = (DashboardBuildingSpace.dashboard
        .buildings[0] as unknown) as Space
      state = reducer(state, actions.onboardingEditBuilding(building))
      expect(state).toMatchSnapshot()
    })
  })
  describe('Onboarding reducer with one edit space', () => {
    it('should return the edited space', () => {
      state = reducer(state, actions.clear())

      const space: Space = (DashboardBuildingSpace.dashboard.spaces[
        'SS_BUILDING_325'
      ][0] as unknown) as Space

      state = reducer(state, actions.onboardingEditSpace(space))
      expect(state).toMatchSnapshot()
    })
  })
})
