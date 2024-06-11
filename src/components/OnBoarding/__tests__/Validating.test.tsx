import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

import Validating from '../Validating'
import { createOnBoardingState } from '../helpers'

const mockState = createOnBoardingState()

jest.mock('react-redux', () => ({
  useSelector: () => () => mockState,
  useDispatch: () => {
    return jest.fn()
  },
}))

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('renders without crashing ', async () => {
  const wrapper = shallow(<Validating />)
  expect(shallowToJson(wrapper)).toMatchSnapshot()
})
