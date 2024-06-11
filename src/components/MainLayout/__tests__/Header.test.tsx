import React from 'react'
import Header from '../Header'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

const mockDispatch = jest.fn()
let mockState: any = {
  user: {
    loading: false,
    decodedToken: { name: 'aass' },
  },
}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: jest.fn(),
  createIntl: jest.fn(),
}))
let mockMediaQuery = true
jest.mock('@material-ui/core/useMediaQuery', () => () => mockMediaQuery)

it('renders without crashing', async () => {
  let wrapper = mount(
    <Router history={createBrowserHistory()}>
      <Header />
    </Router>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()

  mockState = {}
  wrapper = mount(
    <Router history={createBrowserHistory()}>
      <Header />
    </Router>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()

  mockMediaQuery = false
  wrapper = mount(
    <Router history={createBrowserHistory()}>
      <Header />
    </Router>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
