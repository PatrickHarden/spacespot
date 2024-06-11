import React from 'react'
import { render } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import { SpacespotState } from 'services/global/types'
import EditBuilding from '../EditBuilding'
import { createOnBoardingState } from '../helpers'
import msgs from 'translations/en.json'

const mockState: any = {
  onboarding: createOnBoardingState(),
  dashboard: {
    isLoading: true,
    buildings: [
      {
        'Common.PrimaryKey': '0',
      },
    ],
  },
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    buildingId: '0',
  }),
}))

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: SpacespotState) => any) =>
    selector(mockState),
  useDispatch: () => {
    return jest.fn()
  },
}))

jest.mock('@react-google-maps/api', () => {
  const GoogleMap = () => <div />
  const Marker = () => <div />
  const Autocomplete = () => <div />
  const useLoadScript = () => ({ isLoaded: true })
  return { GoogleMap, Marker, Autocomplete, useLoadScript }
})

it('renders Spinner ', async () => {
  const wrapper = render(
    <IntlProvider locale="en-GB" messages={msgs}>
      <EditBuilding />
    </IntlProvider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('renders EditBuilding ', async () => {
  mockState.dashboard.isLoading = false
  const wrapper = render(
    <IntlProvider locale="en-GB" messages={msgs}>
      <EditBuilding />
    </IntlProvider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('loads dashboard', async () => {
  mockState.dashboard = {}
  const wrapper = render(
    <IntlProvider locale="en-GB" messages={msgs}>
      <EditBuilding />
    </IntlProvider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
