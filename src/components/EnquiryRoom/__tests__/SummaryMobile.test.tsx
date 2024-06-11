import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import SummaryMobile from '../SummaryMobile'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: () => jest.fn(),
  createIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockState = {}

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: () => mockState,
}))

it('renders without crashing', async () => {
  const wrapper = mount(<SummaryMobile />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
