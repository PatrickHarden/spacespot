import React from 'react'
import Header from '../EnquiryRoomLayout'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

let mockValue = true
jest.mock('@material-ui/core/useMediaQuery', () => () => mockValue)

it('renders without crashing', async () => {
  const store: any = createMockStore({})

  const wrapper = mount(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <Header />
      </Router>
    </Provider>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
  mockValue = false
  const wrapperMobile = mount(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <Header />
      </Router>
    </Provider>,
  )
  expect(mountToJson(wrapperMobile)).toMatchSnapshot()
})
