import React from 'react'
import { Provider } from 'react-redux'
import { render, fireEvent } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { createMockStore } from 'redux-test-utils'

import { SpacespotState } from 'services/global/types'
import Building from '../Building'
import { createOnBoardingState } from '../helpers'

import GBPlus473580 from 'services/space/__mocks__/GB-Plus-473580.json'
import msgs from 'translations/en.json'

const mockState: SpacespotState = {
  onboarding: createOnBoardingState(),
  dashboard: {
    buildings: [],
    spaces: {},
    isLoading: false,
    initOK: true,
    pendingDelete: [],
  },
}

jest.mock('@react-google-maps/api', () => {
  const GoogleMap = () => <div />
  const Marker = () => <div />
  const Autocomplete = () => <div />
  const useLoadScript = () => ({ isLoaded: true })
  return { GoogleMap, Marker, Autocomplete, useLoadScript }
})

jest.mock('react-quill', () => {
  const ComponentToMock = () => <div />
  return ComponentToMock
})

it('Building launchs init', async () => {
  if (mockState.onboarding) {
    mockState.onboarding.isNew = true
  }
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <IntlProvider locale="en-GB" messages={msgs}>
      <Provider store={store}>
        <Building />
      </Provider>
    </IntlProvider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByTestId('existing-building'))
  fireEvent.click(wrapper.getByTestId('new-building'))
})

it('Building: already initialized', async () => {
  if (mockState.onboarding) {
    mockState.onboarding.isNew = false
  }
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <IntlProvider locale="en-GB" messages={msgs}>
      <Provider store={store}>
        <Building />
      </Provider>
    </IntlProvider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

const convertJsonToSpace = (space: any) => ({
  ...space,
})

it('Building: initOK ', async () => {
  if (mockState.onboarding) {
    mockState.onboarding.isNew = false
  }
  const spaces = [convertJsonToSpace(GBPlus473580).Document]
  if (mockState.dashboard) {
    mockState.dashboard = {
      buildings: spaces,
      spaces: {},
      isLoading: false,
      initOK: true,
      pendingDelete: [],
    }
  }
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <IntlProvider locale="en-GB" messages={msgs}>
      <Provider store={store}>
        <Building />
      </Provider>
    </IntlProvider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
