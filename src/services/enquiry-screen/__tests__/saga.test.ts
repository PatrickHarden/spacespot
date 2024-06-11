import { runSaga, Saga } from 'redux-saga'
import { getEnquirySaga } from '../saga'
import actions from '../actions'
import { EnquiryScreenStateData, EnquiryScreenAction } from '../types'
import { SpacespotState } from '../../global/types'
import { callSaga as enquiryCallSaga } from '../../enquiry/call'
import { callSaga as spaceCallSaga } from '../../space/call'
import { callSaga as appointmentCallSaga } from '../../appointment/call'

jest.mock('../../enquiry/call')
jest.mock('../../space/call')
jest.mock('../../appointment/call')

async function recordSaga(
  saga: Saga,
  initialAction: EnquiryScreenAction,
  state: SpacespotState,
) {
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

describe('Enquiry Screen sagas', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('get saga should call get space SpaceCall and Timer', async () => {
    const state: SpacespotState = {
      enquiry: {
        data: {
          chatId: 1,
          enquireId: 1,
          flex: false,
          spaceId: '1',
          peer1Id: 'test1',
          peer2Id: 'test2',
        },
      },
    }
    ;(spaceCallSaga as jest.Mock).mockImplementation(() => {
      return undefined
    })
    ;(appointmentCallSaga as jest.Mock).mockImplementation(() => {
      return undefined
    })
    const data: EnquiryScreenStateData = {
      id: '1',
    }
    await recordSaga(getEnquirySaga as Saga, actions.get(data), state)
    expect(spaceCallSaga).toHaveBeenCalled()
  })
  it('get saga should call get Enquiry and set error', async () => {
    const state: SpacespotState = {}
    ;(enquiryCallSaga as jest.Mock).mockImplementation(() => {
      return undefined
    })

    const data: EnquiryScreenStateData = {
      id: '1',
    }
    const dispatched = await recordSaga(
      getEnquirySaga as Saga,
      actions.get(data),
      state,
    )
    expect(enquiryCallSaga).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getError('problem selecting enquiry'))
  })
  it('init saga should call get enquiry and receive error', async () => {
    const state: SpacespotState = {}
    ;(enquiryCallSaga as jest.Mock).mockImplementation(() => {
      return true
    })

    const data: EnquiryScreenStateData = {
      id: '1',
    }
    const dispatched = await recordSaga(
      getEnquirySaga as Saga,
      actions.get(data),
      state,
    )
    expect(enquiryCallSaga).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getError('problem fetching enquiry'))
  })
  it('get saga should call get error', async () => {
    const state: SpacespotState = {
      enquiry: {
        data: {
          chatId: 1,
          enquireId: 1,
          flex: false,
          spaceId: '1',
          peer1Id: 'test1',
          peer2Id: 'test2',
        },
      },
    }
    ;(spaceCallSaga as jest.Mock).mockImplementation(() => {
      return true
    })

    const data: EnquiryScreenStateData = {
      id: '1',
    }
    const dispatched = await recordSaga(
      getEnquirySaga as Saga,
      actions.get(data),
      state,
    )
    expect(spaceCallSaga).toHaveBeenCalled()
    expect(dispatched[2]).toEqual(actions.getError('problem fetching space'))
  })
  it('init get saga should fail', async () => {
    const state: SpacespotState = {}
    ;(enquiryCallSaga as jest.Mock).mockImplementation(() => {
      throw Error('Error1')
    })
    const data: EnquiryScreenStateData = {
      id: '1',
    }
    const dispatched = await recordSaga(
      getEnquirySaga as Saga,
      actions.get(data),
      state,
    )
    expect(enquiryCallSaga).toHaveBeenCalled()
    expect(dispatched[0]).toEqual(actions.getError('Error1'))
  })
})
