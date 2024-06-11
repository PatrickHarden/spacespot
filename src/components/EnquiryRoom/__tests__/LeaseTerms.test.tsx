import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import LeaseTerms from '../LeaseTerms'
import { mockState } from '../__mocks__/state'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

it('Renders landlord view (PROPOSED status)', () => {
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <LeaseTerms disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByTestId('modify'))
  fireEvent.click(wrapper.getByTestId('cancel'))
  fireEvent.click(wrapper.getByTestId('modify'))
  fireEvent.change(wrapper.getByTestId('duration'), { target: { value: '10' } })
  fireEvent.change(wrapper.getByTestId('area'), { target: { value: '4000' } })
  fireEvent.change(wrapper.getByTestId('rent'), { target: { value: '4000' } })
  fireEvent.change(wrapper.getByTestId('serviceCharges'), {
    target: { value: '4000' },
  })
  fireEvent.click(wrapper.getByTestId('submit'))
})

it('Renders tenant view (PROPOSED status)', () => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  mockState.user.auth.idToken.claims.extension_Landlord = false
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <LeaseTerms disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByTestId('accept'))
})

it('Renders tenant view (ACCEPTED status)', () => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  mockState.user.auth.idToken.claims.extension_Landlord = false
  mockState.negotiation.data.status = 'ACCEPTED'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <LeaseTerms disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByTestId('decline'))
})
