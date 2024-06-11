import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import FileUpload, { onDropCB } from '../FileUpload'

it('Renders docs', () => {
  const wrapper = mount(
    <FileUpload accept="application/pdf" addFile={jest.fn()}>
      Add file
    </FileUpload>,
  )
  expect(mountToJson(wrapper)).toMatchSnapshot()

  const addFile = () => jest.fn()
  const cb1 = onDropCB(addFile)
  const file = new Blob(['test'], { type: 'pdf' }) as File
  const acceptedFiles = [file]
  cb1([])
  cb1(acceptedFiles)
})
