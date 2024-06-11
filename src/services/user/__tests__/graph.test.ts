import { getUserInfo } from '../graph'

jest.mock('msal')
jest.mock('bootstrap/store', () => ({
  store: {
    getState: () => {
      return { user: { token: '12345' } }
    },
  },
}))

describe('MS Graph', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Test UserInfo', async () => {
    getUserInfo()
  })
})
