import React from 'react'
import { render } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import BothAccepted from '../BothAccepted'
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

it('Renders LeaseAccepted both signed', () => {
  mockState.negotiation.data.peer2SignLeaseStatus = 'LeaseSigned'
  mockState.negotiation.data.peer1SignLeaseStatus = 'LeaseSigned'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <BothAccepted />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Renders LeaseAccepted signed peer1', () => {
  mockState.negotiation.data.peer2SignLeaseStatus = 'LeaseAccepted'
  mockState.negotiation.data.peer1SignLeaseStatus = 'LeaseSigned'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <BothAccepted />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Renders LeaseAccepted signed peer2', () => {
  mockState.negotiation.data.peer2SignLeaseStatus = 'LeaseSigned'
  mockState.negotiation.data.peer1SignLeaseStatus = 'LeaseAccepted'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <BothAccepted />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Uses signer info', () => {
  const signers = [
    {
      recipientId: 1,
      name: 'Name1',
      emailId: 'name1@mail.com',
      signerStatus: 'sent',
      signerType: 'Tenant',
      companyName: 'Comp1',
      companyNumber: '12345678',
    },
    {
      recipientId: 1,
      name: 'Name2',
      emailId: 'name2@mail.com',
      signerStatus: 'sent',
      signerType: 'Landlord',
      companyName: 'Comp2',
      companyNumber: '12345678',
    },
  ]
  mockState.negotiation.signers = signers
  mockState.negotiation.data.peer2SignLeaseStatus = 'LeaseSigned'
  mockState.negotiation.data.peer1SignLeaseStatus = 'LeaseAccepted'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <BothAccepted />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
