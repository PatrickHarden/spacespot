import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import Privacy from '../Privacy'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: jest.fn(),
  createIntl: jest.fn(),
}))

it('renders without crashing ', async () => {
  const store: any = createMockStore({})

  const wrapper = mount(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <Privacy />
      </Router>
    </Provider>,
  )
  act(() => {
    wrapper.update()
  })

  expect(mountToJson(wrapper)).toMatchSnapshot()
})
