import React from 'react'
import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import GBPlus473580 from 'services/space/__mocks__/GB-Plus-473580.json'
import BuildingList, { BuildingBox } from '../BuildingList'

const convertJsonToSpace = (space: any) => ({
  ...space,
})

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

it('renders without crashing ', async () => {
  const spaces = [convertJsonToSpace(GBPlus473580).Document]
  const state = {
    dashboard: {
      buildings: spaces,
    },
  }
  const store: any = createMockStore(state)
  const wrapper = mount(
    <Provider store={store}>
      <BuildingList />
    </Provider>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
  const building = wrapper.find(BuildingBox)
  act(() => {
    building.simulate('click')
    wrapper.update()
  })
})

it('renders initial state', async () => {
  const state = {
    space: {},
  }
  const store: any = createMockStore(state)
  const wrapper = mount(
    <Provider store={store}>
      <BuildingList />
    </Provider>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
