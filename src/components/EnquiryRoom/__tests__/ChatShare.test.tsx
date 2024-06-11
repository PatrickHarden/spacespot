import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'
import { act } from 'react-dom/test-utils'

import { Chat } from '@cbreenterprise/spacespot-ui'
import Appointments from 'components/EnquiryRoom/Appointments/Appointments'
import ChatShare from '../ChatShare'
import { messages } from '../__mocks__/messages'

jest.useFakeTimers()

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

jest.mock('react-quill', () => {
  const ComponentToMock = (props: any) => <textarea {...props} />
  return ComponentToMock
})

it('renders without crashing', async () => {
  const testState = {
    space: {
      item: {
        Document: {},
      },
    },
    chat: {
      data: {
        messages: messages,
      },
    },
  }
  const store: any = createMockStore(testState)
  const wrapper = mount(
    <Provider store={store}>
      <ChatShare scrollTop={0} />
    </Provider>,
  )
  const chat = wrapper.find(Chat)
  const appointments = wrapper.find(Appointments)
  const onScroll = chat.props().onBodyScroll
  const onAdd = appointments.props().onAdd
  const onAccept = appointments.props().onAccept
  const onCancel = appointments.props().onCancel
  const onProposedNew = appointments.props().onProposedNew
  const onSubmit = chat.props().onSubmit

  jest.runAllTimers()

  act(() => {
    if (onScroll) {
      onScroll({} as React.UIEvent)
    }
    if (onAdd) {
      onAdd({ date: new Date(), description: 'test' })
    }
    if (onAccept) {
      onAccept('test')
    }
    if (onCancel) {
      onCancel('test')
    }
    if (onProposedNew) {
      onProposedNew({ id: 'test', date: new Date(), description: 'test' })
    }
    if (onSubmit) {
      onSubmit('test')
    }
    wrapper.update()
  })
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
