import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createOnBoardingState } from '../helpers'
import { Router } from 'react-router-dom'

import { createBrowserHistory } from 'history'

import NextBack from '../NextBack'
import Publish from '../Publish'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({}),
  useLocation: () => ({ pathname: '/onboarding/publish' }),
  useRouteMatch: () => ({ url: '/onboarding/publish' }),
}))

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockState = createOnBoardingState()

jest.mock('react-redux', () => ({
  useSelector: () => mockState,
  useDispatch: () => {
    return jest.fn()
  },
}))

it('renders without crashing ', async () => {
  const wrapper1 = mount(
    <Router history={createBrowserHistory()}>
      <Publish />
    </Router>,
  )
  expect(mountToJson(wrapper1)).toMatchSnapshot()
  const button = wrapper1.find(NextBack).find('button#button-next')
  button.simulate('click')
})
