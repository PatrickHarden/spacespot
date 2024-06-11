import { put, take, call, takeLatest, select } from 'redux-saga/effects'

import constants from './constants'
import actions from './actions'
import { ChatResponse, MessageAction } from './types'
import { getChat, newMessageChat } from './api'
import enquirySelectors from 'services/enquiry/selectors'
import enquiryConstants from 'services/enquiry/constants'
import userSelectors from 'services/user/selectors'

export function* getChatSaga() {
  try {
    let chatId = yield select(enquirySelectors.getChatId)
    if (!chatId) {
      yield take(enquiryConstants.GET_SUCCESS)
      chatId = yield select(enquirySelectors.getChatId)
    }
    const token: string = yield select(userSelectors.token)
    const chat: ChatResponse = yield call(getChat, chatId, token)
    yield put(actions.getSuccess(chat))
  } catch (e) {
    yield put(actions.getError(e.message))
  }
}

export function* newMessageSaga(action: MessageAction) {
  try {
    const chatId = yield select(enquirySelectors.getChatId)
    const token: string = yield select(userSelectors.token)
    const accountIdentifier: string = yield select(
      userSelectors.accountIdentifier,
    )
    const { payload } = action
    const data = {
      userId: accountIdentifier,
      message: payload || '',
    }
    const chat = yield call(newMessageChat, chatId, token, data)
    yield put(actions.newMessageSuccess(chat))
  } catch (e) {
    yield put(actions.newMessageError(e.message))
  }
}

function* saga() {
  yield takeLatest(constants.GET, getChatSaga)
  yield takeLatest(constants.NEW_MESSAGE, newMessageSaga)
}

export default saga
