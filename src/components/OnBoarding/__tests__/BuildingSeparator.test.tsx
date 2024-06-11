import React from 'react'
import BuildingSeparator from '../BuildingSeparator'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('renders without crashing', async () => {
  const wrapper = shallow(<BuildingSeparator />)
  expect(shallowToJson(wrapper)).toMatchSnapshot()
})
