import React from 'react'
import OutlineButton from '../OutlineButton'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('renders without crashing selected false', async () => {
  const wrapper = mount(
    <OutlineButton onClick={jest.fn()} className="Test" selected={false}>
      {'ONBOARDING_EXISTING'}
    </OutlineButton>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
it('renders without crashing selected true', async () => {
  const wrapper = mount(
    <OutlineButton onClick={jest.fn()} className="Test" selected={true}>
      {'ONBOARDING_EXISTING'}
    </OutlineButton>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
