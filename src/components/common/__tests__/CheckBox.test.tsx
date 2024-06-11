import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

import CheckBox from '../CheckBox'

it('renders without crashing ', async () => {
  const wrapper = shallow(<CheckBox>Test</CheckBox>)
  expect(shallowToJson(wrapper)).toMatchSnapshot()
})
