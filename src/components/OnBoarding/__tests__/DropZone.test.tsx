import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import DropZone, { DropItem, ItemThumbnail, dropOnLoadEnd } from '../DropZone'

jest.useFakeTimers()

const data = new Uint8Array(2)
const mockFile = new File([data], 'filename1', { type: 'image/png' })
const item1: DropItem = {
  key: 0,
  name: 'file1',
  type: 'application/pdf',
  uri: './',
}
const item2: DropItem = {
  key: 0,
  name: 'file2',
  type: 'image/png',
  uri: './',
}

let onDrop: (files: Array<File>) => void = jest.fn()

jest.mock('react-dropzone', () => ({
  useDropzone: (options: {
    accept: string
    onDrop: (files: Array<File>) => void
  }) => {
    onDrop = options.onDrop
    return {
      getRootProps: () => '',
      getInputProps: () => '',
    }
  },
}))

it('renders without crashing', async () => {
  const items = [item1] as Array<DropItem>
  const setItems = jest.fn()
  const wrapper = mount(
    <DropZone
      items={items}
      setItems={setItems}
      setUploaded={jest.fn}
      isImage={false}
      accept="image/jpeg, image/png">
      <p>Drop documents here</p>
    </DropZone>,
  )
  const thumb = wrapper.find(ItemThumbnail).first()
  const button = thumb.find('button').first()
  const input = thumb.find('input').first()
  const onRemove = thumb.props().onRemove
  expect(mountToJson(wrapper)).toMatchSnapshot()
  act(() => {
    button.simulate('click')
    input.simulate('change', { target: { value: 'testing' } })
  })
  act(() => {
    onDrop([])
    onDrop([mockFile])
    jest.runAllTimers()
    jest.runAllTicks()
  })
  act(() => {
    if (onRemove) onRemove()
  })
  expect(items.length).toBe(1)
})

it('renders items (png)', async () => {
  const items = [item2] as Array<DropItem>
  const setItems = jest.fn()
  const wrapper = mount(
    <DropZone
      items={items}
      setItems={setItems}
      setUploaded={jest.fn}
      isImage={true}
      accept="image/jpeg, image/png">
      <p>Drop images here</p>
    </DropZone>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})

it('renders items (pdf)', async () => {
  const items = [item2] as Array<DropItem>
  const setItems = jest.fn()
  const wrapper = mount(
    <DropZone
      items={items}
      setItems={setItems}
      setUploaded={jest.fn}
      isImage={false}
      accept="application/pdf">
      <p>Drop documents here</p>
    </DropZone>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()
})

it('updates item array', async () => {
  const items = [item1] as Array<DropItem>
  const setItems = jest.fn()
  dropOnLoadEnd(mockFile, new FileReader(), items, setItems)()
  expect(setItems).toHaveBeenCalled()
})
