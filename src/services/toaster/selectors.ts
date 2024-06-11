import { get } from 'lodash'
import { SpacespotState } from '../global/types'
import { ToasterMessage } from './types'

const getMessages = (state: SpacespotState): Array<ToasterMessage> => {
  const now = Date.now()
  const msgs: Array<ToasterMessage> = get(state, 'toaster.messages', [])
  return msgs.filter(msg => msg.maxTime > now)
}

export default {
  getMessages,
}
