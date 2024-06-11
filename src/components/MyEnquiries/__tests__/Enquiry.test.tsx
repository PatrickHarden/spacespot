import React from 'react'
import Enquiry from '../Enquiry'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { act } from 'react-dom/test-utils'
import actionsMyEnquiries from 'services/myEnquiries/actions'
import { MyEnquiriesAPIResponse } from 'services/myEnquiries/types'
import { TermStatus } from 'services/negotiation/types'
import MockDate from 'mockdate'

const mockDispatch = jest.fn()
const mockState: any = {
  user: {
    loading: false,
    decodedToken: { name: 'aass' },
  },
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
      '10': 'NoOfDesks',
    },
  },
}
const enquireId = 162
const enquiry: MyEnquiriesAPIResponse = {
  enquireId,
  negotiationId: 142,
  enquireStatus: 'PENDING_TO_ACCEPT' as TermStatus,
  spaceId: 'SS_SPACE_650',
  terms: [
    { termId: 1, value: '12' },
    { termId: 2, value: '12.0' },
    {
      termId: 3,
      value:
        'Thu Feb 20 2020 18:24:05 GMT+0100 (hora estándar de Europa central)',
    },
    { termId: 4, value: '1' },
    { termId: 5, value: '' },
    { termId: 6, value: '' },
    { termId: 7, value: '' },
    { termId: 8, value: '123.0' },
    { termId: 9, value: '' },
  ],

  messages: [
    {
      userId: 'de2563f1-2e15-4a6a-9e39-9600a8ad4ec1',
      message: 'dd',
      sentAt: '2020-02-20T17:24:15.755+0000',
    },
  ],
}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))
jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))
let mockMediaQuery = true
jest.mock('@material-ui/core/useMediaQuery', () => () => mockMediaQuery)

it('renders without crashing', async () => {
  MockDate.set(1434319925275)
  const dispatch = mockDispatch
  const wrapper = mount(<Enquiry enquiry={enquiry} isPending={true} />)
  expect(mountToJson(wrapper)).toMatchSnapshot()

  const buttonDecline = wrapper.find('button[data-testid="enquiry-decline"]')
  act(() => {
    buttonDecline.simulate('click', { stopPropagation: jest.fn() })
  })
  expect(dispatch).toHaveBeenCalledWith(
    actionsMyEnquiries.reject(enquireId.toString()),
  )
  const buttonAccept = wrapper.find('button[data-testid="enquiry-accept"]')
  act(() => {
    buttonAccept.simulate('click', { stopPropagation: jest.fn() })
  })
  expect(dispatch).toHaveBeenCalledWith(
    actionsMyEnquiries.accept(enquireId.toString()),
  )
  mockMediaQuery = false
  const wrapperMediaQuery = mount(
    <Enquiry enquiry={enquiry} isPending={true} />,
  )
  expect(mountToJson(wrapperMediaQuery)).toMatchSnapshot()
  MockDate.reset()
})
