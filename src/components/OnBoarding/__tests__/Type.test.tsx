import React from 'react'
import Type from '../Type'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { act } from 'react-dom/test-utils'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('renders without crashing ', async () => {
  const setType = jest.fn()
  const wrapper = mount(<Type selected={'test'} onClick={setType} />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
  const buttons = wrapper.find('button')
  act(() => {
    buttons.at(0).simulate('click')
  })
  expect(setType).toHaveBeenCalledWith('FIXED')
  act(() => {
    buttons.at(1).simulate('click')
  })
  expect(setType).toHaveBeenCalledWith('FLEX')
})
