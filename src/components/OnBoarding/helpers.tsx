import {
  OnBoardingState,
  SpaceData,
  SpaceStatus,
  AvailabilityFlexPriceInterval,
} from 'services/onboarding/types'

const date = new Date('2020/01/01')

export const createSpace = (type: string): SpaceData => ({
  id: '0',
  type,
  spaceName: '',
  spaceDescription: '',
  spaceHighlights: '',
  spaceSize: undefined,
  spaceFloor: undefined,
  spaceSizeCommon: undefined,
  spaceMatterPort: '',
  spaceFloored: '',
  use: '',
  spaceRent: undefined,
  spaceServices: undefined,
  spaceServicesNotNegotiable: false,
  availabilityFixed: date,
  months: undefined,
  hotDesks: {
    desks: 0,
    availableFrom: date,
    minLease: 0,
    price: 0,
    currencyCode: 'NOK',
    frequency: AvailabilityFlexPriceInterval.Monthly,
  },
  fixedDesks: {
    desks: 0,
    availableFrom: date,
    minLease: 0,
    price: 0,
    currencyCode: 'NOK',
    frequency: AvailabilityFlexPriceInterval.Monthly,
  },
  servicedOffices: [],
  images: [],
  floorPlan: [],
  fitout: [{ description: 'FitOut1', name: 'FitOut1', amount: 1000 }],
  status: SpaceStatus.ReadyForPublish,
})

export const createOnBoardingState = (): OnBoardingState => ({
  isNew: true,
  buildingId: undefined,
  images: [
    {
      key: 0,
      name: '40VilliersStreet.External_Photo_1_small.png',
      type: 'image/png',
      uri:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    },
  ],
  docs: [],
  name: '',
  description: '',
  address: '',
  city: '',
  postCode: '',
  country: '',
  location: '',
  latLng: undefined,
  district: '',
  subdistrict: {
    id: 0,
    name: '',
  },
  amenities: { hasGym: { checked: true, desc: 'Gym' } },
  spaces: { '0': createSpace('FLEX') },
  spaceCount: 1,
})

export const valInteger = (
  current: number | undefined,
  value: number,
  min: number,
  max?: number,
): number => {
  const val = Number(Number(value).toFixed())
  return val < min || (max && val > max) ? current || 0 : val
}
