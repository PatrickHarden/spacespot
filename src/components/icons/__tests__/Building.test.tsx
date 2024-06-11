import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import Comp from '../Building'

describe('Building icon', () => {
  it('renders without crashing', async () => {
    const wrapper = mount(<Comp />)
    expect(mountToJson(wrapper)).toMatchSnapshot()
  })
})
