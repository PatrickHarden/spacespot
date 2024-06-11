import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { act } from 'react-dom/test-utils'
import { createSpace } from '../helpers'

import FitoutOptions from '../FitoutOptions'

jest.mock('react-quill', () => {
  const ComponentToMock = (props: any) => <textarea {...props} />
  return ComponentToMock
})

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => {
    return mockDispatch
  },
  useSelector: () => () => '',
}))

it('renders without crashing ', async () => {
  const wrapper1 = mount(<FitoutOptions space={createSpace('FLEX')} />)
  expect(mountToJson(wrapper1)).toMatchSnapshot()
  // open form
  wrapper1.find('button').simulate('click')
  act(() => {
    wrapper1.update()
  })
  // fill form
  wrapper1
    .find('input[type="text"]')
    .simulate('change', { target: { value: 'name1' } })
  wrapper1.find('textarea').simulate('change', { target: { value: 'desc1' } })
  wrapper1
    .find('input[type="number"]')
    .simulate('change', { target: { value: '2' } })
  const buttons = wrapper1.find('button')
  act(() => {
    // save fitout
    buttons.at(1).simulate('click')
    wrapper1.update()
    // cancel fitout
    wrapper1
      .find('button')
      .at(0)
      .simulate('click')
    // remove
    wrapper1.find('svg').simulate('click')
  })
})
