import { ToasterState } from './types'
import types from './constants'

const reducer = (state: ToasterState = { messages: [] }, action: any) => {
  const now = Date.now()
  if (action.type === types.ADD_MSG) {
    return {
      ...state,
      messages: [...state.messages, action.payload].filter(
        msg => msg.maxTime > now,
      ),
    }
  }
  return state
}

export default reducer
