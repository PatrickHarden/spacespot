import React from 'react'
import Layout from '../Layout'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

it('renders without crashing', async () => {
  const wrapper = shallow(
    <Layout>
      <div>test</div>
    </Layout>,
  )
  expect(shallowToJson(wrapper)).toMatchSnapshot()
})
