import React from 'react'
import DetailsFixed from '../DetailsFixed'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import Space1 from 'services/space/__mocks__/space1.json'
import { Space } from 'services/space'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    spaceId: '0',
  }),
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
  space: { selectedSpace: { Document: { ...Space1 } } },
}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))

it('renders without crashing', async () => {
  const spaceDocument1: Space = {
    ...((Space1 as unknown) as Space),
  }
  const wrapper = mount(<DetailsFixed space={spaceDocument1} />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
