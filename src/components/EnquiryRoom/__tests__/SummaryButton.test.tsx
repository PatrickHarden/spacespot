import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import SummaryButton from '../SummaryButton'

import { mockState } from '../__mocks__/state'
import {
  NegotiationStatus,
  SpecialProvisionStatus,
} from 'services/negotiation/types'

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

it('TermsNotAgreed', () => {
  mockNeg.peer1SignLeaseStatus = NegotiationStatus.TermsNotAgreed
  mockNeg.peer2SignLeaseStatus = NegotiationStatus.TermsNotAgreed
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SummaryButton />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Landlord: TermsAgreed', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Accepted
  mockNeg.peer1SignLeaseStatus = NegotiationStatus.TermsAgreed
  mockNeg.peer2SignLeaseStatus = NegotiationStatus.TermsAgreed
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SummaryButton />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByText('SUMMARY_CTA_PREVIEW'))
})

it('Tenant: TermsAgreed', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Accepted
  mockNeg.peer1SignLeaseStatus = NegotiationStatus.TermsNotAgreed
  mockNeg.peer2SignLeaseStatus = NegotiationStatus.TermsNotAgreed
  mockState.user.auth.idToken.claims['extension_Landlord'] = false
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SummaryButton />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
