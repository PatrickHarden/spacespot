import React from 'react'
import { act } from 'react-dom/test-utils'
import BuildingDetailsForm, { BuildingFormFields } from '../BuildingDetailsForm'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createOnBoardingState } from '../helpers'
import { Autocomplete } from '@react-google-maps/api'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: () => jest.fn(),
  createIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

jest.mock('react-quill', () => {
  const ComponentToMock = () => <div />
  return ComponentToMock
})

const mockState = createOnBoardingState()

jest.mock('react-redux', () => ({
  useSelector: () => mockState,
  useDispatch: () => {
    return jest.fn()
  },
}))

const mockPlace = {
  getPlace: () => ({
    // eslint-disable-next-line @typescript-eslint/camelcase
    formatted_address: 'Street 56, 1',
    // eslint-disable-next-line @typescript-eslint/camelcase
    address_components: [
      {
        types: ['postal_code'],
        // eslint-disable-next-line @typescript-eslint/camelcase
        long_name: '808',
      },
      {
        types: ['country'],
        // eslint-disable-next-line @typescript-eslint/camelcase
        long_name: 'NO',
      },
      {
        types: ['locality'],
        // eslint-disable-next-line @typescript-eslint/camelcase
        long_name: 'Oslo',
      },
    ],
  }),
}

jest.mock('@react-google-maps/api', () => {
  const GoogleMap = () => <div />
  const Marker = () => <div />
  const Autocomplete = (props: {
    children: React.ReactNode
    onLoad: () => void
    onPlaceChanged: (place: any) => void
  }) => {
    props.onLoad()
    props.onPlaceChanged(mockPlace)
    return <div>{props.children}</div>
  }
  const useLoadScript = () => ({ isLoaded: true })
  return { GoogleMap, Marker, Autocomplete, useLoadScript }
})

it('renders without crashing ', async () => {
  const fields: BuildingFormFields = {
    location: '',
    address: '',
    city: '',
    postCode: '',
    district: '',
    country: '',
    subdistrict: {
      id: 0,
      name: '',
    },
  }
  const errors = {}
  const wrapper = mount(
    <BuildingDetailsForm
      fields={fields}
      setFields={jest.fn()}
      errors={errors}
    />,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
  act(() => {
    const autocomplete = wrapper.find(Autocomplete)
    const onLoad = autocomplete.props().onLoad
    const placeChanged = autocomplete.props().onPlaceChanged
    if (onLoad && placeChanged) {
      onLoad((mockPlace as unknown) as google.maps.places.Autocomplete)
      placeChanged()
    }
    const postCode = wrapper.find('input#postCode')
    postCode.simulate('change', { target: { value: '12345' } })
    const address = wrapper.find('input#address')
    address.simulate('change', { target: { value: '12345' } })
    const city = wrapper.find('input#city')
    city.simulate('change', { target: { value: '12345' } })
    wrapper.update()
  })
})
