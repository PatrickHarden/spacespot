import { callSaga } from '../call'
import { take, put, select } from 'redux-saga/effects'
import actions from '../actions'
import constants from '../constants'
import selectors from '../selectors'

describe('Enquiry call', () => {
  it('saga should call get space API', async () => {
    const idEnquiry = '1'
    const gen = callSaga(idEnquiry)
    expect(gen.next().value).toStrictEqual(put(actions.get(idEnquiry)))
    expect(gen.next().value).toStrictEqual(
      take([constants.GET_SUCCESS, constants.GET_ERROR]),
    )
    expect(gen.next().value).toStrictEqual(select(selectors.getError))
    expect(gen.next().done).toStrictEqual(true)
  })
})
