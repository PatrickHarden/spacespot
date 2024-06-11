/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import SelectFitOut from '../SelectFitOut'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))
let mockState = {
  user: { auth: { idToken: { claims: { extension_Landlord: false } } } },
  space: {},
}

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => selector(mockState),
}))
it('renders without crashing tenant', async () => {
  const wrapper = mount(<SelectFitOut />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
it('renders without crashing Landlord', async () => {
  mockState.user.auth.idToken.claims.extension_Landlord = true
  const wrapper = mount(<SelectFitOut />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
it('renders without crashing tenant with common fitout', async () => {
  mockState = {
    user: { auth: { idToken: { claims: { extension_Landlord: false } } } },
    space: {
      item: {
        Document: {
          'Common.FitOutOptions': [
            {
              'Common.Identifier': 1,
              'Common.Name': [{ 'Common.Text': 'a' }],
              'Common.Description': [{ 'Common.Text': 'a' }],
              'Common.Charges': [{ 'Common.Amount': 'a' }],
            },
          ],
        },
      },
    },
  }

  const wrapper = mount(<SelectFitOut />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
