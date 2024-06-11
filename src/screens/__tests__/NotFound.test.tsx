import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import NotFound from '../NotFound'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: jest.fn(),
  createIntl: jest.fn(),
}))

it('renders without crashing ', async () => {
  const store: any = createMockStore({})

  const wrapper = render(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <NotFound />
      </Router>
    </Provider>,
  )

  expect(wrapper.asFragment()).toMatchSnapshot()
})
