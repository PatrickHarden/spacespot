import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import Summary from '../Summary'

import { mockState } from '../__mocks__/state'
import { NegotiationStatus } from 'services/negotiation/types'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: () => jest.fn(),
  createIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()
const mockNeg = mockState.negotiation.data

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

it('PreviewStart', () => {
  mockState.negotiation.data.peer1SignLeaseStatus =
    NegotiationStatus.PreviewStart
  mockState.negotiation.data.peer2SignLeaseStatus =
    NegotiationStatus.PreviewStart
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <Summary />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByText('SUMMARY_PREVIEW_CTA_PREVIEW'))
  fireEvent.click(wrapper.getByText('SUMMARY_CTA_CONTINUE'))
  fireEvent.click(wrapper.getByText('SUMMARY_CTA_BACK_NEGOTIATION'))
})

it('TermsAgreed', () => {
  mockNeg.peer1SignLeaseStatus = NegotiationStatus.TermsAgreed
  mockNeg.peer2SignLeaseStatus = NegotiationStatus.TermsAgreed
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <Summary />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('SignInfo', () => {
  mockNeg.peer1SignLeaseStatus = NegotiationStatus.SignInfo
  mockNeg.peer2SignLeaseStatus = NegotiationStatus.SignInfo
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <Summary />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('AcceptLease', () => {
  mockNeg.peer1SignLeaseStatus = NegotiationStatus.AcceptLease
  mockNeg.peer2SignLeaseStatus = NegotiationStatus.AcceptLease
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <Summary />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('LeasseAccepted', () => {
  mockNeg.peer1SignLeaseStatus = NegotiationStatus.LeaseAccepted
  mockNeg.peer2SignLeaseStatus = NegotiationStatus.LeaseAccepted
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <Summary />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
