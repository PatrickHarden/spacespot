import reducer from '../reducer'
import actions from '../actions'
import { ChatAction, ChatResponse, ChatState } from '../types'

describe('chat reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as ChatAction)).toEqual({})
  })
  it('get success should update state', () => {
    const resp: ChatState = {} as ChatState
    expect(reducer(undefined, actions.get())).toEqual(resp)
  })

  it('search error should update state', () => {
    const err = { error: 'Error1' }
    expect(reducer(undefined, actions.getError('Error1'))).toEqual(err)
  })

  it('get success should update state', () => {
    const resp: ChatResponse = {} as ChatResponse
    expect(reducer(undefined, actions.getSuccess(resp))).toEqual({
      data: resp,
    })
  })

  it('get success message sent update state', () => {
    const message = {
      userId: 'test Peer1 id',
      message: 'message',
      sentAt: '2019-10-10T15:38:48.321+0000',
    }
    const state = {
      data: {
        chatId: 1,
        enquiryId: 1,
        peer1Id: 'test id 1',
        peer2Id: 'test id 2',
        messages: [],
      },
    }
    expect(reducer(state, actions.newMessageSuccess(message))).toEqual({
      data: {
        chatId: 1,
        enquiryId: 1,
        messages: [
          {
            message: 'message',
            sentAt: '2019-10-10T15:38:48.321+0000',
            userId: 'test Peer1 id',
          },
        ],
        peer1Id: 'test id 1',
        peer2Id: 'test id 2',
      },
    })
  })
})
