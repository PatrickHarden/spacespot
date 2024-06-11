import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import SpecialProvisions from '../SpecialProvisions'

import { mockState } from '../__mocks__/state'
import { SpecialProvisionStatus } from 'services/negotiation/types'

jest.mock('react-quill', () => {
  const ComponentToMock = (props: any) => <textarea {...props} />
  return ComponentToMock
})

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

it('Landlord Empty', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Accepted
  mockNeg.specialProvision = ''
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByText('SPECIAL_PROV_ADD'))
  fireEvent.change(wrapper.getByLabelText('SPECIAL_PROV_FORM_LABEL'), {
    target: { value: 'Prov1' },
  })
  fireEvent.click(wrapper.getByText('SPECIAL_PROV_CANCEL'))
})

it('Landlord Accepted with content', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Accepted
  mockNeg.specialProvision = 'Provision 1'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByText('SPECIAL_PROV_MODIFY'))
  fireEvent.click(wrapper.getByText('SPECIAL_PROV_CANCEL'))
  fireEvent.click(wrapper.getByText('SPECIAL_PROV_MODIFY'))
  fireEvent.click(wrapper.getByText('SPECIAL_PROV_SAVE'))
  fireEvent.click(wrapper.getByTestId('removeSP'))
})

it('Landlord Created', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Created
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Landlord Declined', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Declined
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Landlord closed', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Closed
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Tenant Accepted', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Accepted
  mockState.user.auth.idToken.claims['extension_Landlord'] = false
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByText('NEGOTIATE_DECLINE'))
})

it('Tenant Declined', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Declined
  mockState.user.auth.idToken.claims['extension_Landlord'] = false
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByText('NEGOTIATE_ACCEPT'))
})

it('Tenant Empty', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Accepted
  mockState.user.auth.idToken.claims['extension_Landlord'] = false
  mockNeg.specialProvision = ''
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Tenant created', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Created
  mockState.user.auth.idToken.claims['extension_Landlord'] = false
  mockNeg.specialProvision = 'Test'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={false} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Tenant disabled', () => {
  mockNeg.specialProvisionStatus = SpecialProvisionStatus.Accepted
  mockState.user.auth.idToken.claims['extension_Landlord'] = false
  mockNeg.specialProvision = 'Test'
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SpecialProvisions disabled={true} />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})
