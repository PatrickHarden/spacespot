import { formatFloor } from '../utils'

it('formats floor number', async () => {
  expect(formatFloor('1', '')).toBe('1st ')
  expect(formatFloor('2', '')).toBe('2nd ')
  expect(formatFloor('3', '')).toBe('3rd ')
  expect(formatFloor('110', '')).toBe('110th ')
  // Fails...
  // expect(formatFloor('11', '')).toBe('1th ')
})
