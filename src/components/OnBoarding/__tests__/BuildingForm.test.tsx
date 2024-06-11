import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import BuildingForm from '../BuildingForm'
import { SpacespotState } from 'services/global/types'
import { createOnBoardingState } from '../helpers'

const mockState: any = {
  onboarding: createOnBoardingState(),
  space: {
    dashboard: {
      isLoading: true,
      buildings: [
        {
          'Common.PrimaryKey': '0',
        },
      ],
    },
  },
}

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: SpacespotState) => any) =>
    selector(mockState),
  useDispatch: () => {
    return mockDispatch
  },
}))

jest.mock('react-intl', () => {
  const FormattedMessage = () => <div />
  const useIntl = () => ({ formatMessage: (s: any) => s.id })
  return {
    FormattedMessage,
    useIntl,
    createIntlCache: jest.fn(),
    createIntl: jest.fn(),
  }
})

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

it('renders without crashing ', async () => {
  const wrapper = render(<BuildingForm />)
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByTestId('button-next'))
})

it('renders editing ', async () => {
  const wrapper = render(<BuildingForm isEditing={true} />)
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByTestId('button-back'))
})

it('renders editing validation OK', async () => {
  mockState.onboarding.name = 'test'
  mockState.onboarding.address = 'test'
  mockState.onboarding.city = 'test'
  mockState.onboarding.postCode = 'test'
  const wrapper = render(<BuildingForm isEditing={true} />)
  fireEvent.click(wrapper.getByTestId('button-next'))
})
