import React from 'react'
import OnBoardingLayout from '../OnBoardingLayout'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: jest.fn(),
  createIntl: jest.fn(),
}))

it('renders without crashing', async () => {
  const wrapper = shallow(
    <OnBoardingLayout>
      <div></div>
    </OnBoardingLayout>,
  )
  expect(shallowToJson(wrapper)).toMatchSnapshot()
})
