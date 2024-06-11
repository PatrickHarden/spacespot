import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import SpacesSeparator from '../SpacesSeparator'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

it('renders without crashing', () => {
  const wrapper = mount(<SpacesSeparator num={1} />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
