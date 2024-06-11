import { runSaga, Saga } from 'redux-saga'
import { take, select } from 'redux-saga/effects'
import { getChatSaga, newMessageSaga } from '../saga'
import actions from '../actions'
import { ChatAction, ChatResponse, ChatMessage } from '../types'
import { getChat, newMessageChat } from '../api'
import enquiryConstants from 'services/enquiry/constants'
import enquirySelectors from 'services/enquiry/selectors'

jest.mock('../api')

const state1 = {
  user: {
    auth: {},
    token: 'testing',
  },
  enquiry: {
    data: {
      chatId: '1',
    },
  },
}

async function recordSaga(saga: Saga, initialAction: ChatAction, state: any) {
  const dispatched: Array<unknown> = []
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
      getState: () => state,
    },
    saga,
    initialAction,
  ).toPromise()
  return dispatched
}

describe('Chat sagas', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('saga should wait space', async () => {
    const gen = getChatSaga()
    expect(gen.next().value).toEqual(select(enquirySelectors.getChatId))
    expect(gen.next().value).toEqual(take(enquiryConstants.GET_SUCCESS))
    expect(gen.next().value).toEqual(select(enquirySelectors.getChatId))
  })

  it('get chat saga should call get chat API', async () => {
    const mockedResponse = {} as ChatResponse
    const getChatMock = getChat as jest.Mock
    getChatMock.mockImplementation(() => {
      return mockedResponse
    })
    const dispatched = await recordSaga(
      getChatSaga as Saga,
      actions.get(),
      state1,
    )
    expect(getChat).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getSuccess(mockedResponse))
  })

  it('get chat saga should call get chat API and return error', async () => {
    const getChatMock = getChat as jest.Mock
    getChatMock.mockImplementation(() => {
      throw Error('Error')
    })
    const dispatched = await recordSaga(
      getChatSaga as Saga,
      actions.get(),
      state1,
    )
    expect(getChat).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getError('Error'))
  })
  it('New message should call chat API', async () => {
    const mockedResponse = {} as ChatMessage
    const newMessageChatMock = newMessageChat as jest.Mock
    newMessageChatMock.mockImplementation(() => {
      return mockedResponse
    })
    const payload = 'test'
    const dispatched = await recordSaga(
      newMessageSaga as Saga,
      actions.newMessage(payload),
      state1,
    )
    expect(newMessageChat).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.newMessageSuccess(mockedResponse))
  })
  it('New message should call chat API and error', async () => {
    const newMessageChatMock = newMessageChat as jest.Mock
    newMessageChatMock.mockImplementation(() => {
      throw Error('Error')
    })
    const payload = 'test'
    const dispatched = await recordSaga(
      newMessageSaga as Saga,
      actions.newMessage(payload),
      state1,
    )
    expect(newMessageChat).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.newMessageError('Error'))
  })
})
