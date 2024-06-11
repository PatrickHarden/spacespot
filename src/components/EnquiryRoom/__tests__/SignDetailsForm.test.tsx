import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import SignDetailsForm from '../SignDetailsForm'

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

it('Renders without crash', () => {
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <SignDetailsForm />
    </Provider>,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.change(wrapper.getByTestId('name'), { target: { value: '' } })
  fireEvent.change(wrapper.getByTestId('emailId'), { target: { value: '' } })
  fireEvent.change(wrapper.getByTestId('companyName'), {
    target: { value: '' },
  })
  fireEvent.change(wrapper.getByTestId('companyNumber'), {
    target: { value: '' },
  })
  fireEvent.click(wrapper.getByText('SUMMARY_CTA_CONTINUE'))
  fireEvent.change(wrapper.getByTestId('name'), { target: { value: 'Name1' } })
  fireEvent.change(wrapper.getByTestId('emailId'), {
    target: { value: 'test@email.com' },
  })
  fireEvent.change(wrapper.getByTestId('companyName'), {
    target: { value: 'Company1' },
  })
  fireEvent.change(wrapper.getByTestId('companyNumber'), {
    target: { value: '1234567' },
  })
  fireEvent.click(wrapper.getByText('SUMMARY_CTA_CONTINUE'))
  fireEvent.click(wrapper.getByText('SUMMARY_CTA_CANCEL'))
})

it('Posts signerInfo', () => {
  mockState.negotiation.signerInfo = null
  const store: any = createMockStore(mockState)

  const w = render(
    <Provider store={store}>
      <SignDetailsForm />
    </Provider>,
  )
  fireEvent.change(w.getByTestId('name'), { target: { value: 'Name1' } })
  fireEvent.change(w.getByTestId('emailId'), {
    target: { value: 'test@email.com' },
  })
  fireEvent.change(w.getByTestId('companyName'), {
    target: { value: 'Company1' },
  })
  fireEvent.change(w.getByTestId('companyNumber'), {
    target: { value: '1234567' },
  })
  fireEvent.click(w.getByText('SUMMARY_CTA_CONTINUE'))
})
