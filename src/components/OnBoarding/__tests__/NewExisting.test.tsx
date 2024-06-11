import React from 'react'
import NewExisting from '../NewExisting'

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { act } from 'react-dom/test-utils'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('renders without crashing ', async () => {
  const setIsNew = jest.fn()
  const wrapper = mount(
    <NewExisting hasBuildings={true} selected onClick={setIsNew} />,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
  const buttons = wrapper.find('button')
  act(() => {
    buttons.at(0).simulate('click')
  })
  expect(setIsNew).toHaveBeenCalledWith(false)
  act(() => {
    buttons.at(1).simulate('click')
  })
  expect(setIsNew).toHaveBeenCalledWith(true)
})

it('renders without crashing without buildings ', async () => {
  const setIsNew = jest.fn()
  const wrapper = mount(
    <NewExisting hasBuildings={false} selected onClick={setIsNew} />,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
