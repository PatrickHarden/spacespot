import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createOnBoardingState } from '../helpers'
import selectors from 'services/onboarding/selectors'

import PublishedSpace from '../PublishedSpace'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDate = new Date('2020/01/01')
const mockState = createOnBoardingState()
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))

it('renders without crashing ', async () => {
  const state = { onboarding: mockState }
  const spaces = selectors.onboardingState2Space(state)
  spaces[0].availability = mockDate
  const wrapper1 = mount(
    <PublishedSpace space={spaces[0]} key={spaces[0].key} />,
  )
  expect(mountToJson(wrapper1)).toMatchSnapshot()
})
