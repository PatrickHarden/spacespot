import React from 'react'
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import SpaceDetails from '../SpaceDetails'
import { createBrowserHistory } from 'history'

import { mockState } from '../__mocks__/state'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: () => jest.fn(),
  createIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

it('Renders without crash', () => {
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Router history={createBrowserHistory()}>
      <Provider store={store}>
        <SpaceDetails />
      </Provider>
    </Router>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
