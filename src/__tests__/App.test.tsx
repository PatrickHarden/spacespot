import React from 'react'
import { Router } from 'react-router-dom'
import App, { when } from '../App'
import { render } from '@testing-library/react'
import { createBrowserHistory } from 'history'

const mockState: any = {
  search: {
    filters: {
      desks: '',
    },
  },
  user: {
    loading: false,
  },
}

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: any) => any) => selector(mockState),
  useDispatch: () => jest.fn(),
}))

const mockSuccessResponse = {}
const globalAny: any = global
globalAny.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockSuccessResponse),
  }),
)

it('renders without crashing', async () => {
  Object.defineProperty(navigator, 'language', {
    value: 'en_EN',
    writable: true,
  })
  const wrapper = render(
    <Router history={createBrowserHistory()}>
      <App />
    </Router>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Renders with default language', async () => {
  Object.defineProperty(navigator, 'language', { value: 'zz_ZZ' })
  const wrapper = render(
    <Router history={createBrowserHistory()}>
      <App />
    </Router>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Check returns component', async () => {
  const DummyComp = () => <App />
  const dummySelector = () => true
  const Comp1 = when(dummySelector, DummyComp, '/')
  const wrapper = render(
    <Router history={createBrowserHistory()}>
      <Comp1 />
    </Router>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Check returns Redirect', async () => {
  const DummyComp = () => <App />
  const dummySelector = () => false
  const Comp1 = when(dummySelector, DummyComp, '/')
  const wrapper = render(
    <Router history={createBrowserHistory()}>
      <Comp1 />
    </Router>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Auth loading', async () => {
  mockState.user.loading = true
  const wrapper = render(
    <Router history={createBrowserHistory()}>
      <App />
    </Router>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
