import React from 'react'
import ConfirmDialog from '../ConfirmDialog'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { Dialog } from '@material-ui/core'

it('renders without crashing', async () => {
  const setOpen = jest.fn()
  const onClick = jest.fn()
  const wrapper = mount(
    <ConfirmDialog
      open={true}
      setOpen={setOpen}
      onClick={onClick}
      title="Test"
      bodyText="Test body"
      cancelText="Cancel"
      okText="OK"
    />,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
  wrapper.find('button#dialogCancel').simulate('click')
  expect(setOpen).toHaveBeenCalledWith(false)
  wrapper.find('button#dialogDelete').simulate('click')
  expect(onClick).toHaveBeenCalled()
  const onClose = wrapper.find(Dialog).props().onClose
  if (onClose) {
    onClose({}, 'backdropClick')
  }
  expect(setOpen).toHaveBeenCalledTimes(2)
})

it('renders without body', async () => {
  const setOpen = jest.fn()
  const onClick = jest.fn()
  const wrapper = mount(
    <ConfirmDialog
      open={true}
      setOpen={setOpen}
      onClick={onClick}
      title="Test"
      cancelText="Cancel"
      okText="OK"
    />,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})
