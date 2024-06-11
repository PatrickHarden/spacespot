import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import AmenityList from '../AmenityList'
import CheckBox from 'components/common/CheckBox'
import { SpacespotState } from 'services/global/types'

const mockDispatch = jest.fn()
const mockState = {}
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: SpacespotState) => any) =>
    selector(mockState),
}))

it('renders without crashing ', async () => {
  const amenities = {
    op1: { desc: 'op1', checked: true },
  }
  const wrapper = mount(<AmenityList amenities={amenities} />)
  const item = wrapper.find(CheckBox)
  const onchange = item.props().onChange
  if (onchange) {
    onchange({ target: { checked: true } } as React.ChangeEvent<
      HTMLInputElement
    >)
  }
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
