import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'

import List from '../PropertyListings'
import data from '../__mocks__/list.json'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

test('Shows the building details', async () => {
  const testState = {
    search: { search: data },
  }
  const store: any = createMockStore(testState)
  const container = render(
    <Provider store={store}>
      <Router history={createMemoryHistory({ initialEntries: ['/list'] })}>
        <Switch>
          <Route path="/list" component={List} />
        </Switch>
      </Router>
      ,
    </Provider>,
  )
  expect(container.asFragment()).toMatchSnapshot()
  // Does not work:
  // see https://github.com/testing-library/dom-testing-library/releases/tag/v7.0.0
  //
  // const map = await container.findByTestId('map')
  // const map = await waitForElement(() => container.getByTestId('map'))
  // expect(map).toBeDefined()
})
