import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Router } from 'react-router-dom'

import { createBrowserHistory } from 'history'

import { createOnBoardingState } from '../helpers'
import MockDate from 'mockdate'

import Space from '../Space'
import Type from '../Type'

jest.mock('react-quill', () => {
  const ComponentToMock = (props: any) => <textarea {...props} />
  return ComponentToMock
})

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    spaceId: '0',
  }),
  useLocation: () => ({ pathname: '/onboarding/space/0' }),
  useRouteMatch: () => ({ url: '/onboarding/space/0' }),
}))

const mockState = createOnBoardingState()

jest.mock('react-redux', () => ({
  useSelector: () => mockState,
  useDispatch: () => {
    return jest.fn()
  },
}))

it('renders without crashing ', async () => {
  MockDate.set(1434319925275)
  const wrapper1 = mount(
    <Router history={createBrowserHistory()}>
      <Space />
    </Router>,
  )
  expect(mountToJson(wrapper1)).toMatchSnapshot()
  MockDate.reset()
  const buttons = wrapper1
    .find(Type)
    .find('button')
    .first()
  buttons.simulate('click')
})
