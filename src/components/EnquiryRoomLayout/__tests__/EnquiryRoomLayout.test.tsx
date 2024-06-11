import React from 'react'
import EnquiryRoomLayout from '../EnquiryRoomLayout'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

it('renders without crashing', async () => {
  const wrapper = shallow(<EnquiryRoomLayout />)
  expect(shallowToJson(wrapper)).toMatchSnapshot()
})
