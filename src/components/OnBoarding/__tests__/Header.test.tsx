import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createOnBoardingState } from '../helpers'

import Header from '../Header'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockState = createOnBoardingState()

jest.mock('react-redux', () => ({
  useSelector: () => mockState,
  useDispatch: () => {
    return jest.fn()
  },
}))

it('renders without crashing ', async () => {
  const wrapper1 = mount(<Header onAdd={jest.fn()} />)
  expect(mountToJson(wrapper1)).toMatchSnapshot()
  const wrapper2 = mount(<Header onAdd={jest.fn()} />)
  expect(mountToJson(wrapper2)).toMatchSnapshot()
})
