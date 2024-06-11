import {
  AuthenticationProvider,
  ClientOptions,
  Client,
} from '@microsoft/microsoft-graph-client'

import { store } from 'bootstrap/store'

class SSAuthenticationProvider implements AuthenticationProvider {
  public async getAccessToken(): Promise<any> {
    return store.getState().user.token
  }
}

const clientOptions: ClientOptions = {
  authProvider: new SSAuthenticationProvider(),
}

// User.ReadBasic.All
// const res = await client.api('/users').get()
export const getUserInfo = async () => {
  const client = Client.initWithMiddleware(clientOptions)
  return await client.api('/me').get()
}
