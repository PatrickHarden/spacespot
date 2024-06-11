import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createOnBoardingState } from '../helpers'

import Published from '../Published'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockState = createOnBoardingState()

jest.mock('react-redux', () => ({
  useSelector: () => [mockState],
  useDispatch: () => {
    return jest.fn()
  },
}))

it('renders without crashing ', async () => {
  const wrapper1 = mount(<Published />)
  expect(mountToJson(wrapper1)).toMatchSnapshot()
})
