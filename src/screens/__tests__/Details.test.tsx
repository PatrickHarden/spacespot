import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { render } from '@testing-library/react'

import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'
import Details from '../PropertyDetails'
import { createMemoryHistory } from 'history'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

test('Shows the building details', () => {
  const testState = {}
  const store: any = createMockStore(testState)
  const container = render(
    <Provider store={store}>
      <Router history={createMemoryHistory({ initialEntries: ['/details/1'] })}>
        <Switch>
          <Route path="/details/:spaceId" component={Details} />
        </Switch>
      </Router>
      ,
    </Provider>,
  )
  expect(container.asFragment()).toMatchSnapshot()
})

test('Incorrect route', () => {
  const testState = {}
  const store: any = createMockStore(testState)
  const container = render(
    <Provider store={store}>
      <Router history={createMemoryHistory({ initialEntries: ['/details/1'] })}>
        <Details />
      </Router>
    </Provider>,
  )
  expect(container.asFragment()).toMatchSnapshot()
})
