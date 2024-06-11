import React from 'react'
import SpaceAvailabilityFlex from '../SpaceAvailabilityFlex'
import { render, fireEvent } from '@testing-library/react'
import { createSpace } from '../helpers'
import MockDate from 'mockdate'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => {
    return mockDispatch
  },
  useSelector: () => () => '',
}))

const emptyDesks = {
  id: '0',
  value: {
    availableFrom: jasmine.anything(),
    currencyCode: jasmine.anything(),
    desks: 0,
    minLease: 0,
    price: 0,
    frequency: 'Monthly',
  },
}

it('Renders without crashing ', async () => {
  MockDate.set(1434319925275)
  const spaceMock = createSpace('')
  const wrapper = render(
    <SpaceAvailabilityFlex space={spaceMock} setError={jest.fn()} />,
  )
  expect(wrapper.asFragment()).toMatchSnapshot()
})

it('Hot desks edit', async () => {
  const dispatch = mockDispatch
  MockDate.reset()
  const spaceMock = createSpace('')
  const wrapper = render(
    <SpaceAvailabilityFlex space={spaceMock} setError={jest.fn()} />,
  )
  const desks = wrapper.getByTestId('hot-desks-desks')
  const minLease = wrapper.getByTestId('hot-desks-min-lease')
  const price = wrapper.getByTestId('hot-desks-price')
  fireEvent.change(minLease, { target: { value: 12 } })
  expect(dispatch).toHaveBeenLastCalledWith({
    payload: emptyDesks,
    type: 'ONBOARDING/SET_SPACE_HOT_DESKS',
  })
  fireEvent.change(price, { target: { value: 2000 } })
  expect(dispatch).toHaveBeenLastCalledWith({
    payload: emptyDesks,
    type: 'ONBOARDING/SET_SPACE_HOT_DESKS',
  })
  fireEvent.change(desks, { target: { value: 10 } })
  expect(dispatch).toHaveBeenLastCalledWith({
    payload: {
      id: '0',
      value: {
        availableFrom: jasmine.anything(),
        currencyCode: jasmine.anything(),
        desks: 10,
        minLease: 12,
        price: 2000,
        frequency: 'Monthly',
      },
    },
    type: 'ONBOARDING/SET_SPACE_HOT_DESKS',
  })
})

it('Fixed desks edit', async () => {
  const dispatch = mockDispatch
  MockDate.reset()
  const spaceMock = createSpace('')
  const wrapper = render(
    <SpaceAvailabilityFlex space={spaceMock} setError={jest.fn()} />,
  )
  const desks = wrapper.getByTestId('fixed-desks-desks')
  const minLease = wrapper.getByTestId('fixed-desks-min-lease')
  const price = wrapper.getByTestId('fixed-desks-price')
  fireEvent.change(minLease, { target: { value: 12 } })
  expect(dispatch).toHaveBeenLastCalledWith({
    payload: emptyDesks,
    type: 'ONBOARDING/SET_SPACE_FIXED_DESKS',
  })
  fireEvent.change(price, { target: { value: 2000 } })
  expect(dispatch).toHaveBeenLastCalledWith({
    payload: emptyDesks,
    type: 'ONBOARDING/SET_SPACE_FIXED_DESKS',
  })
  fireEvent.change(desks, { target: { value: 10 } })
  expect(dispatch).toHaveBeenLastCalledWith({
    payload: {
      id: '0',
      value: {
        availableFrom: jasmine.anything(),
        currencyCode: jasmine.anything(),
        desks: 10,
        minLease: 12,
        price: 2000,
        frequency: 'Monthly',
      },
    },
    type: 'ONBOARDING/SET_SPACE_FIXED_DESKS',
  })
})
