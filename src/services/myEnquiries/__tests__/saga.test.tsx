import { select, call, all, put } from 'redux-saga/effects'

import { getToken } from 'services/user/token'
import userSelectors from 'services/user/selectors'
import actionsSpace from 'services/space/actions'

import actions from '../actions'
import {
  getMyEnquiriesAPI,
  acceptMyEnquiriesAPI,
  rejectMyEnquiriesAPI,
  cancelMyEnquiriesAPI,
} from '../api'
import {
  getMyEnquiriesSaga,
  acceptMyEnquiriesSaga,
  rejectMyEnquiriesSaga,
  cancelMyEnquiriesSaga,
} from '../saga'

type AnyGen = Generator<void, any, any>

describe('MyEnquiries sagas', () => {
  it('getMyEnquiriesSaga should work', async () => {
    const gen = getMyEnquiriesSaga() as AnyGen
    const token = '123'
    const spaceId = '123'
    const reply: any = [{ spaceId }]

    expect(gen.next().value).toEqual(call(getToken))
    expect(gen.next(token).value).toEqual(select(userSelectors.isLandlord))
    expect(gen.next(false).value).toEqual(call(getMyEnquiriesAPI, token))
    expect(gen.next(reply).value).toEqual(all([]))
    expect(gen.next(reply).value).toEqual(
      all([put(actionsSpace.getSpace(spaceId))]),
    )
    expect(gen.next().value).toEqual(put(actions.getSuccess(reply)))
    expect(gen.next().value).toEqual(put(actions.getNotifications()))

    expect(gen.next().done).toEqual(true)
  })

  it('acceptMyEnquiriesSaga should work', async () => {
    const enquiryId = '123'
    const gen = acceptMyEnquiriesSaga(actions.accept(enquiryId)) as AnyGen
    const token = '123'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(acceptMyEnquiriesAPI, token, enquiryId),
    )

    expect(gen.next(reply).value).toEqual(put(actions.acceptSuccess(reply)))

    expect(gen.next().done).toEqual(true)
  })
  it('rejectMyEnquiriesSaga should work', async () => {
    const enquiryId = '123'
    const gen = rejectMyEnquiriesSaga(actions.reject(enquiryId)) as AnyGen
    const token = '123'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(rejectMyEnquiriesAPI, token, enquiryId),
    )

    expect(gen.next(reply).value).toEqual(put(actions.rejectSuccess(reply)))

    expect(gen.next().done).toEqual(true)
  })
  it('cancelMyEnquiriesSaga should work', async () => {
    const enquiryId = '123'
    const gen = cancelMyEnquiriesSaga(
      actions.cancel({ enquiryId, feedback: '' }),
    ) as AnyGen
    const token = '123'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(cancelMyEnquiriesAPI, token, enquiryId, ''),
    )

    expect(gen.next(reply).value).toEqual(put(actions.cancelSuccess(reply)))

    expect(gen.next().done).toEqual(true)
  })
})
