import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'

import UserProfile from '../UserProfile'
import { mockState } from '../__mocks__/state'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntlCache: () => jest.fn(),
  createIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

const Comp = () => {
  const [show, setShow] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setShow(true)
  }
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <UserProfile show={show} setShow={setShow} anchorEl={anchorEl} />
    </div>
  )
}

it('Renders without crashing', () => {
  const store: any = createMockStore(mockState)
  const wrapper = render(
    <Provider store={store}>
      <Comp />
    </Provider>,
  )
  fireEvent.click(wrapper.getByText('Click'))
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.click(wrapper.getByText('NAV_EDIT_PROFILE'))
  expect(wrapper.asFragment()).toMatchSnapshot()
  fireEvent.change(wrapper.getByTestId('name'), {
    target: { value: 'UserName1' },
  })
  fireEvent.click(wrapper.getByText('EDIT_PROFILE_CANCEL'))
  fireEvent.click(wrapper.getByText('NAV_EDIT_PROFILE'))
  fireEvent.click(wrapper.getByText('EDIT_PROFILE_SAVE'))
})
