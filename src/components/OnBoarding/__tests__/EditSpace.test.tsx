import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import { SpacespotState } from 'services/global/types'
import EditSpace from '../EditSpace'
import { createOnBoardingState } from '../helpers'
import MockDate from 'mockdate'

jest.mock('react-quill', () => {
  const ComponentToMock = () => <div />
  return ComponentToMock
})

const mockState: any = {
  onboarding: createOnBoardingState(),
  dashboard: {
    isLoading: true,
    buildings: [
      {
        'Common.PrimaryKey': '0',
      },
    ],
  },
}

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    spaceId: '0',
  }),
}))

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: SpacespotState) => any) =>
    selector(mockState),
  useDispatch: () => {
    return jest.fn()
  },
}))

it('renders Spinner', async () => {
  const wrapper = mount(<EditSpace />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})

it('renders EditSpace', async () => {
  MockDate.set(1434319925275)
  mockState.dashboard.isLoading = false
  const wrapper = mount(<EditSpace />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
  MockDate.reset()
})

it('loads dashboard', async () => {
  mockState.space = {}
  const wrapper = mount(<EditSpace />)
  wrapper.update()
})
