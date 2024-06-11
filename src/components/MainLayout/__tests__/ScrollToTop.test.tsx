import React from 'react'
import ScrollToTop from '../ScrollToTop'
import { mount } from 'enzyme'

const mockUnload = jest.fn()
const mockScrollTo = jest.fn()

jest.mock('react-router-dom', () => ({
  useHistory: () => {
    return {
      listen: (f: () => void) => {
        f()
        return mockUnload
      },
    }
  },
}))

it('renders without crashing', async () => {
  Object.defineProperty(window, 'scrollTo', {
    value: mockScrollTo,
    writable: true,
  })

  const wrapper = mount(
    <ScrollToTop>
      <p>Test</p>
    </ScrollToTop>,
  )
  expect(mockScrollTo).toHaveBeenCalled()
  wrapper.unmount()
  expect(mockUnload).toHaveBeenCalled()
})
