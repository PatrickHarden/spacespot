import React from 'react'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'

import { DocumentDTO } from 'services/enquiry/types'
import Documents, { Attachment, TrashImg, ViewAllButton } from '../Documents'
import FileUpload from '../FileUpload'
import { act } from 'react-dom/test-utils'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDoc: DocumentDTO & { isMine: boolean } = {
  enquireId: 1,
  fileId: 1,
  fileName: 'filename1',
  uploadAt: new Date('2020/01/01'),
  uploadedBy: 'user1',
  isMine: true,
}
let mockDocs: Array<DocumentDTO> = [mockDoc]
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: () => mockDocs,
}))

it('Renders docs', () => {
  const wrapper = mount(<Documents />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
})

it('Actions call dispatch', () => {
  const wrapper = mount(<Documents />)
  const addFile = wrapper.find(FileUpload).props().addFile
  const getDoc = wrapper
    .find(Attachment)
    .at(1)
    .props().onClick
  const delDoc = wrapper.find(TrashImg).props().onClick
  const reader = { result: 'test' } as FileReader
  const file = { name: 'filename2', type: 'pdf' } as File
  addFile(file, reader)()
  expect(mockDispatch).toHaveBeenCalledTimes(1)
  getDoc()
  expect(mockDispatch).toHaveBeenCalledTimes(2)
  delDoc()
  expect(mockDispatch).toHaveBeenCalledTimes(3)
})

it('Renders empty docs', () => {
  mockDocs = []
  const wrapper = mount(<Documents />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
  mockDocs = [mockDoc]
})

it('Renders view all docs', () => {
  const d = (n: number) => ({ ...mockDoc, fileId: n })
  mockDocs = [d(1), d(2), d(3), d(4), d(5)]
  const wrapper = mount(<Documents />)
  expect(mountToJson(wrapper)).toMatchSnapshot()
  const viewAll = wrapper.find(ViewAllButton)
  act(() => {
    viewAll.simulate('click')
  })
  wrapper.update()
  expect(mountToJson(wrapper)).toMatchSnapshot()
  mockDocs = [mockDoc]
})
