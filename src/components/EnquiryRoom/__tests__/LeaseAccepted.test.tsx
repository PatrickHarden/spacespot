import React from 'react'
import { render } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import LeaseAccepted from '../LeaseAccepted'
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

it('Renders LeaseAccepted', () => {
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <LeaseAccepted />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
