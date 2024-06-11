import React from 'react'
import Toaster from '../Toaster'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

const mockDispatch = jest.fn()
const mockState: any = {}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}))

it('renders without crashing', async () => {
  const wrapper = mount(<Toaster />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})

it('Toast error', async () => {
  const maxT = Number.MAX_VALUE
  mockState.toaster = {
    messages: [{ type: 'error', message: 'Error 1', maxTime: maxT }],
  }
  const wrapper = mount(<Toaster />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})

it('Toast success', async () => {
  const maxT = Number.MAX_VALUE
  mockState.toaster = {
    messages: [{ type: 'success', message: 'OK 1', maxTime: maxT }],
  }
  const wrapper = mount(<Toaster />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
