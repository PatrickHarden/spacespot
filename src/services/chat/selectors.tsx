import React from 'react'
import styled from 'styled-components'
import { get } from 'lodash'
import moment from 'moment'
import { ChatMsgProps } from '@cbreenterprise/spacespot-ui'
import { SpacespotState } from '../global/types'
import { ChatMessage } from './types'
import eventSelectors from 'services/event/selectors'
import userSelectors from 'services/user/selectors'
import Avatar from 'components/Avatar/Avatar'

const getChat = (state: SpacespotState) => get(state, 'chat.data')
const getChatId = (state: SpacespotState) => get(getChat(state), 'chatId')
const getEnquiryId = (state: SpacespotState) => get(getChat(state), 'enquiryId')
const getPeer1Id = (state: SpacespotState) => get(getChat(state), 'peer1Id')
const getPeer2Id = (state: SpacespotState) => get(getChat(state), 'peer2Id')
const getMessages = (state: SpacespotState): Array<ChatMessage> =>
  get(getChat(state), 'messages')

const ChatAvatar = styled(Avatar)`
  flex: 0 0 auto;
`

const getAvatar = (id: string, isLandlord: boolean) => {
  return <ChatAvatar userId={id} isLandlord={isLandlord} />
}

const getMessagesUser = (state: SpacespotState): Array<ChatMsgProps> => {
  const accountIdentifier = userSelectors.accountIdentifier(state)
  const isLandlord = userSelectors.isLandlord(state)
  const messages = getMessages(state)
  const enquiryId = getEnquiryId(state)
  const events = eventSelectors.getEvents(enquiryId)(state)

  const eventMsgs = events
    ? events.map(e => {
        const isOwn = e.eventMessage.user === accountIdentifier
        const isLandlordMsg = isLandlord ? isOwn : !isOwn
        return {
          ...e,
          id: e.eventDate.toString(),
          isOwn: isOwn,
          time: moment(e.eventDate).toDate(),
          text: '',
          avatar: () => getAvatar(e.eventMessage.user, isLandlordMsg),
        }
      })
    : []

  const userMsgs = messages
    ? messages
        .map(msg => {
          if (!msg.message || msg.message === '') {
            return undefined
          }
          const isOwn = msg.userId === accountIdentifier
          const isLandlordMsg = isLandlord ? isOwn : !isOwn
          return {
            id: msg.sentAt,
            isOwn: isOwn,
            time: moment(msg.sentAt).toDate(),
            text: msg.message,
            avatar: () => getAvatar(msg.userId, isLandlordMsg),
          }
        })
        .filter(msg => msg !== undefined)
    : []

  const sortedMsgs = eventMsgs
    .concat(userMsgs as Array<any>)
    .sort(function(a, b) {
      return a.time.getTime() - b.time.getTime()
    })
    .map((msg: any) => ({
      ...msg,
      time: moment(msg.time).fromNow(),
    }))
  return sortedMsgs
}

const getError = (state: SpacespotState) => get(state, 'chat.error')

export default {
  getChat,
  getChatId,
  getEnquiryId,
  getPeer1Id,
  getPeer2Id,
  getMessages,
  getMessagesUser,
  getError,
}
