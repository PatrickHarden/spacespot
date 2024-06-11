import * as Msal from 'msal'
import { SpacespotState } from '../../global/types'
import selectors from '../selectors'

describe('User selectors', () => {
  const loggedState: SpacespotState = {
    user: { loading: false, auth: {} as Msal.AuthResponse },
  }
  const notLoggedState: SpacespotState = {
    user: { loading: false },
  }
  const loadingState: SpacespotState = {
    user: { loading: true },
  }
  const isLandlordState: SpacespotState = {
    user: {
      loading: false,
      auth: ({
        idToken: { claims: { extension_Landlord: true } },
      } as unknown) as Msal.AuthResponse,
    },
  }
  const newUserState: SpacespotState = {
    user: {
      loading: false,
      decodedToken: { newUser: true },
    },
  }

  it('selector should return true if the user is logged', () => {
    expect(selectors.isLogged(loggedState)).toBeTruthy()
  })
  it('selector should return false if the user is not logged', () => {
    expect(selectors.isLogged(notLoggedState)).toBeFalsy()
  })
  it('selector should return true if its landlord', () => {
    expect(selectors.isLandlord(isLandlordState)).toBeTruthy()
  })
  it('selector should return false if the user is not logged to landlord', () => {
    expect(selectors.isLandlord(notLoggedState)).toBeFalsy()
  })
  it('selector should return true if its loading', () => {
    expect(selectors.isLoading(loadingState)).toBeTruthy()
  })
  it('selector should return false if the user is not logged to loading', () => {
    expect(selectors.isLoading(notLoggedState)).toBeFalsy()
  })
  it('selector should return true if its loading', () => {
    expect(selectors.isNewUser(newUserState)).toBeTruthy()
  })
  it('selector should return false if the user is not logged to loading', () => {
    expect(selectors.isLoading(notLoggedState)).toBeFalsy()
  })
})
