import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import Building from '../Building'

import buildingData from '../__mock__/building'
import spacesData from '../__mock__/spaces'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()
const mockState = {}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))

it('renders without crashing', () => {
  const wrapper = mount(
    <Router history={createBrowserHistory()}>
      <Building building={buildingData} spaces={spacesData} />
    </Router>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})

it('renders without crashing without spaces', () => {
  const wrapper = mount(
    <Router history={createBrowserHistory()}>
      <Building building={buildingData} spaces={[]} />
    </Router>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
