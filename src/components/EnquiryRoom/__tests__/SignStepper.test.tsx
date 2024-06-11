import React from 'react'
import { render } from '@testing-library/react'

import SignStepper from '../SignStepper'

import { NegotiationStatus } from 'services/negotiation/types'

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

it('Renders without crash', () => {
  const wrapper = render(
    <SignStepper
      userStatus={NegotiationStatus.LeaseAccepted}
      peerStatus={NegotiationStatus.LeaseAccepted}
    />,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Case SignInfo', () => {
  const wrapper = render(
    <SignStepper
      userStatus={NegotiationStatus.SignInfo}
      peerStatus={NegotiationStatus.LeaseAccepted}
    />,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Case AcceptLease', () => {
  const wrapper = render(
    <SignStepper
      userStatus={NegotiationStatus.AcceptLease}
      peerStatus={NegotiationStatus.LeaseAccepted}
    />,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Case peer not LeaseAccepted', () => {
  const wrapper = render(
    <SignStepper
      userStatus={NegotiationStatus.LeaseAccepted}
      peerStatus={NegotiationStatus.SignInfo}
    />,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Case peer LeaseSignInitiated', () => {
  const wrapper = render(
    <SignStepper
      userStatus={NegotiationStatus.LeaseSigned}
      peerStatus={NegotiationStatus.LeaseSignInitiated}
    />,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
