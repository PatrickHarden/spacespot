import { callSaga } from '../call'
import { take, put, select } from 'redux-saga/effects'
import actions from '../actions'
import constants from '../constants'
import selectors from '../selectors'

describe('Space call', () => {
  it('saga should call get space API', async () => {
    const gen = callSaga()
    expect(gen.next().value).toStrictEqual(put(actions.getInit()))
    expect(gen.next().value).toStrictEqual(
      take([constants.GET_SUCCESS, constants.GET_ERROR]),
    )
    expect(gen.next().value).toStrictEqual(select(selectors.selectSpaceError))
    expect(gen.next().done).toStrictEqual(true)
  })
})
