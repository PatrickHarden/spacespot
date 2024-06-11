import React from 'react'
import EnquiryDialogFlex from '../EnquiryDialogFlex'

import space1 from 'services/space/__mocks__/space1.json'
import MockDate from 'mockdate'

import { render, fireEvent, prettyDOM } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { EnquiryType } from 'services/enquiry'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    spaceId: '0',
  }),
  Link: () => null,
}))

const mockDispatch = jest.fn()
const mockState: any = {
  negotiation: {
    termsFields: {
      '1': 'Area',
      '2': 'Rent',
      '3': 'Start',
      '4': 'Duration',
      '5': 'Frequency',
      '6': 'AdditionalCosts',
      '7': 'Deposit',
      '8': 'ServiceCharges',
      '9': 'DepositType',
    },
  },
  space: { selectedSpace: { Document: { ...space1 } } },
}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))
it('renders without crashing', async () => {
  MockDate.set(1434319925275)
  const setOpen = jest.fn()
  const wrapper = render(<EnquiryDialogFlex open={true} setOpen={setOpen} />)
  // Dialog is not in the component, snapshot the whole screen
  expect(prettyDOM()).toMatchSnapshot()
  expect(
    wrapper.queryByText('ENQUIRY_DIALOG_FLEX_PEOPLE'),
  ).not.toBeInTheDocument()
  const hotDesksRadioButton = wrapper.getByDisplayValue(EnquiryType.HotDesk)
  fireEvent(
    hotDesksRadioButton,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  expect(wrapper.queryByText('ENQUIRY_DIALOG_FLEX_PEOPLE')).toBeInTheDocument()
  expect(
    wrapper.queryByText('50 DETAILS_SERVICED_OFFICES_PEOPLE - 2 kr / Daily'),
  ).not.toBeInTheDocument()
  const SevicedOfficesRadioButton = wrapper.getByDisplayValue(
    EnquiryType.ServicedOffice,
  )
  fireEvent(
    SevicedOfficesRadioButton,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
  expect(
    wrapper.queryByText('50 DETAILS_SERVICED_OFFICES_PEOPLE - 2 kr / Daily'),
  ).toBeInTheDocument()
  expect(
    wrapper.queryByText('ENQUIRY_DIALOG_FLEX_PEOPLE'),
  ).not.toBeInTheDocument()

  MockDate.reset()
})
