import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Router } from 'react-router-dom'

import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'
import Enquiries from '../Enquiries'
import { createBrowserHistory } from 'history'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('connected comp renders without crashing', async () => {
  const testState = {}
  const store: any = createMockStore(testState)
  const wrapper = mount(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <Enquiries />
      </Router>
    </Provider>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
