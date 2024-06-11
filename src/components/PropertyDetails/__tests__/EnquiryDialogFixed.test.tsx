import React from 'react'
import EnquiryDialogFixed from '../EnquiryDialogFixed'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Dialog } from '@material-ui/core'
import { act } from 'react-dom/test-utils'
import DatePicker from 'components/common/DatePicker'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
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
}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))

it('renders without crashing', async () => {
  const setOpen = jest.fn()
  const wrapper = mount(<EnquiryDialogFixed open={true} setOpen={setOpen} />)
  const onChange = wrapper.find(DatePicker).props().onChange
  act(() => {
    onChange('2099-01-01')
  })
  wrapper.update()
  expect(mountToJson(wrapper)).toMatchSnapshot()
  wrapper.find('button#dialogOK').simulate('click')
  const onClose = wrapper.find(Dialog).props().onClose
  if (onClose) {
    onClose({}, 'backdropClick')
  }
  expect(setOpen).toHaveBeenCalledTimes(1)
})

it('validation works', async () => {
  const setOpen = jest.fn()
  const wrapper = mount(<EnquiryDialogFixed open={true} setOpen={setOpen} />)
  const onChange = wrapper.find(DatePicker).props().onChange
  act(() => {
    onChange('2099-01-01')
  })
  wrapper.update()
  expect(mountToJson(wrapper)).toMatchSnapshot()
  const length = wrapper.find('input#length')
  const msg = wrapper.find('textarea')
  act(() => {
    length.simulate('change', { target: { value: '-1' } })
    wrapper.find('button#dialogOK').simulate('click')
  })
  act(() => {
    length.simulate('change', { target: { value: '12' } })
    msg.simulate('change', { target: { value: 'Hello' } })
    wrapper.find('button#dialogOK').simulate('click')
  })
  wrapper.update()
})

it('renders without terms', async () => {
  mockState.negotiation = {}
  const setOpen = jest.fn()
  const wrapper = mount(<EnquiryDialogFixed open={true} setOpen={setOpen} />)
  const onChange = wrapper.find(DatePicker).props().onChange
  act(() => {
    const length = wrapper.find('input#length')
    length.simulate('change', { target: { value: '1' } })
    onChange('2099-01-01')
  })
  wrapper.update()
  expect(mountToJson(wrapper)).toMatchSnapshot()
  act(() => {
    wrapper.find('button#dialogOK').simulate('click')
  })
  wrapper.update()
})
