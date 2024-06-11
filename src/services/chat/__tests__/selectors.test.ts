import * as Msal from 'msal'
import { SpacespotState } from '../../global/types'
import { ChatResponse } from '../types'
import selectors from '../selectors'

describe('Chat selectors', () => {
  const errorState: SpacespotState = {
    chat: { error: 'test' },
  }

  const messages = [
    {
      userId: 'test Peer1 id',
      message: 'message',
      sentAt: '2009-10-10T15:38:48.321+0000',
    },
  ]
  const chatData: ChatResponse = {
    chatId: 1,
    enquiryId: 1,
    peer1Id: 'test Peer1 id',
    peer2Id: 'test Peer2 id',
    messages,
  } as ChatResponse

  const stateChat: SpacespotState = {
    chat: {
      data: chatData,
    },
  }

  const stateUser = {
    user: {
      auth: ({
        account: { accountIdentifier: 'test Peer1 id' },
      } as unknown) as Msal.AuthResponse,
    },
    chat: {
      data: chatData,
    },
  } as SpacespotState

  it('selector should return error', () => {
    expect(selectors.getError(errorState)).toEqual('test')
  })

  it('selector should return same chat', () => {
    expect(selectors.getChat(stateChat)).toEqual(chatData)
  })
  it('selector should return chatId', () => {
    expect(selectors.getChatId(stateChat)).toEqual(1)
  })
  it('selector should not return chatId', () => {
    expect(selectors.getChatId(errorState)).toEqual(undefined)
  })

  it('selector should return enquireId', () => {
    expect(selectors.getEnquiryId(stateChat)).toEqual(1)
  })
  it('selector should not return enquireId', () => {
    expect(selectors.getEnquiryId(errorState)).toEqual(undefined)
  })

  it('selector should return peer1Id', () => {
    expect(selectors.getPeer1Id(stateChat)).toEqual('test Peer1 id')
  })
  it('selector should not return peer1Id', () => {
    expect(selectors.getPeer1Id(errorState)).toEqual(undefined)
  })

  it('selector should return peer2Id', () => {
    expect(selectors.getPeer2Id(stateChat)).toEqual('test Peer2 id')
  })
  it('selector should not return peer2Id', () => {
    expect(selectors.getPeer2Id(errorState)).toEqual(undefined)
  })
  it('selector should return messages', () => {
    expect(selectors.getMessages(stateChat)).toEqual(messages)
  })
  it('selector should not return messages', () => {
    expect(selectors.getMessages(errorState)).toEqual(undefined)
  })
  it('selector should return messages from data state', () => {
    expect(selectors.getMessagesUser(stateUser)).toEqual([
      {
        id: '2009-10-10T15:38:48.321+0000',
        isOwn: true,
        text: 'message',
        time: jasmine.any(String),
        avatar: jasmine.anything(),
      },
    ])
  })
  it('selector should not return messages from data state', () => {
    expect(selectors.getMessagesUser(errorState)).toEqual([])
  })
})
