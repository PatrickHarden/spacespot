import { select, call, put } from 'redux-saga/effects'

import userSelectors from '../../user/selectors'
import actions from '../actions'
import { getEnquiryEvents } from '../api'
import { getEnquiryEventsSaga } from '../saga'

type AnyGen = Generator<void, any, any>

describe('Get Enquiry Events sagas', () => {
  it('getEnquiryEventsSaga should work', async () => {
    const enquiryId = '1'
    const gen = getEnquiryEventsSaga(actions.get(enquiryId)) as AnyGen
    const token = '123'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(getEnquiryEvents, token, enquiryId),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.getSuccess(enquiryId, reply)),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('getEnquiryEventsSaga should fail', async () => {
    const enquiryId = '1'
    const gen = getEnquiryEventsSaga(actions.get(enquiryId)) as AnyGen
    const token = '123'
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(getEnquiryEvents, token, enquiryId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.getError(enquiryId, 'Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
})
