import React from 'react'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { createMockStore } from 'redux-test-utils'
import { mount, ReactWrapper } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import { SpacespotState } from 'services/global/types'
import SpaceForm from '../SpaceForm'
import { createOnBoardingState, createSpace } from '../helpers'
import DropZone from '../DropZone'
import NextBack from '../NextBack'
import MockDate from 'mockdate'

jest.mock('react-quill', () => {
  const ComponentToMock = (props: any) => <textarea {...props} />
  return ComponentToMock
})

const mockState: SpacespotState = {
  onboarding: createOnBoardingState(),
}

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const sim = (w: ReactWrapper, id: string, value: string) => {
  return w.find(id).simulate('change', { target: { value } })
}

const fill = (w: ReactWrapper) => {
  sim(w, 'input#spaceName', 'Space1')
  sim(w, 'textarea#spaceDescription', 'Space1 desc')
  sim(w, 'textarea#spaceHighlights', 'Space1 highl')
  sim(w, 'input#spaceMatterPort', 'https://spacespot.com')
}

it('SpaceForm new flex', async () => {
  MockDate.set(1434319925275)
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
  const space = createSpace('FLEX')
  if (mockState.onboarding) {
    mockState.onboarding.spaces[0] = space
  }
  const store: any = createMockStore(mockState)
  const w = mount(
    <Provider store={store}>
      <SpaceForm space={space} isEditing={false} />
    </Provider>,
  )
  expect(mountToJson(w)).toMatchSnapshot()
  act(() => {
    const dropzone1 = w.find(DropZone).at(0)
    const setItems1 = dropzone1.props().setItems
    const setUploaded1 = dropzone1.props().setUploaded
    const dropzone2 = w.find(DropZone).at(1)
    const setItems2 = dropzone2.props().setItems
    const setUploaded2 = dropzone2.props().setUploaded
    setItems1([])
    setUploaded1([])
    setItems2([])
    setUploaded2([])
    fill(w)
    sim(w, 'input#hot-desks-desks', '50')
    sim(w, 'input#hot-desks-minLease', '1')
    sim(w, 'input#hot-desks-price', '5000')
    sim(w, 'input#fixed-desks-desks', '50')
    sim(w, 'input#fixed-desks-minLease', '1')
    sim(w, 'input#fixed-desks-price', '5000')
    sim(w, 'input#serviced-offices-desks', '50')
    sim(w, 'input#serviced-offices-min-lease', '1')
    sim(w, 'input#serviced-offices-price', '5000')
    const nextback = w.find(NextBack)
    const next = nextback.props().next.onClick
    next()
  })
})

it('SpaceForm edit fixed', async () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
  const space = createSpace('FIXED')
  if (mockState.onboarding) {
    mockState.onboarding.spaces[0] = space
  }
  const store: any = createMockStore(mockState)
  const w = mount(
    <Provider store={store}>
      <SpaceForm space={space} isEditing={true} />
    </Provider>,
  )
  expect(mountToJson(w)).toMatchSnapshot()
  act(() => {
    fill(w)
    w.find('input#spaceFloor').simulate('change', { target: { value: '1' } })
    w.find('input#spaceSize').simulate('change', { target: { value: '500' } })
    w.find('input#spaceSizeCommon').simulate('change', {
      target: { value: '550' },
    })
    w.find('input#months').simulate('change', { target: { value: '1' } })
    w.find('input#spaceRent').simulate('change', { target: { value: '10000' } })
    w.find('input#spaceServices').simulate('change', {
      target: { value: '5000' },
    })
    const nextback = w.find(NextBack)
    const next = nextback.props().next.onClick
    next()
    MockDate.reset()
  })
})
