import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import LeaseTemplate from '../LeaseTemplate'
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

it('Renders template link', () => {
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <LeaseTemplate disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByTestId('download'))
  fireEvent.click(wrapper.getByTestId('upload'))
})
