import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createSpace } from '../helpers'

import SpaceCard from '../SpaceCard'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

jest.mock('react-redux', () => ({
  useSelector: () => () => '',
}))

it('renders without crashing ', async () => {
  const cb = () => jest.fn()
  const wrapper1 = mount(
    <SpaceCard
      onClick={cb}
      onDuplicate={cb}
      onRemove={cb}
      space={createSpace('FLEX')}
    />,
  )
  expect(mountToJson(wrapper1)).toMatchSnapshot()
  const wrapper2 = mount(
    <SpaceCard
      onClick={cb}
      onDuplicate={cb}
      onRemove={cb}
      space={createSpace('FIXED')}
    />,
  )
  expect(mountToJson(wrapper2)).toMatchSnapshot()
})
