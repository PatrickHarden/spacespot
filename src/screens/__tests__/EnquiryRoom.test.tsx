import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Router } from 'react-router-dom'

import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'
import EnquiryRoom from '../EnquiryRoom'
import { createBrowserHistory } from 'history'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    spaceId: '111',
  }),
  useLocation: () => ({ pathname: '/enquiry/1/chat' }),
  useRouteMatch: () => ({ url: '/company/company-id1/team/team-id1' }),
}))

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('connected comp renders without crashing', async () => {
  const testState = {
    space: {
      item: {
        Document: {},
      },
    },
  }
  const store: any = createMockStore(testState)
  const wrapper = mount(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <EnquiryRoom />
      </Router>
    </Provider>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
