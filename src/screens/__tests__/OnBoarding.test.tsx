import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import Onboarding from 'screens/OnBoarding'

import GBPlus473580 from 'services/space/__mocks__/GB-Plus-473580.json'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const convertJsonToSpace = (space: any) => ({
  ...space,
})

it('renders without crashing ', async () => {
  const spaces = [convertJsonToSpace(GBPlus473580).Document]
  const state = {
    space: {
      search: {
        Found: true,
        DocumentCount: 1,
        Took: '1s',
        Documents: [spaces],
      },
    },
  }
  // store for existing buildings
  const store: any = createMockStore(state)

  const wrapper = mount(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <Onboarding />
      </Router>
    </Provider>,
  )
  act(() => {
    wrapper.update()
  })

  expect(mountToJson(wrapper)).toMatchSnapshot()
})
