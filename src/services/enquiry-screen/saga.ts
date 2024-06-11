import { put, call, all, takeLatest, select } from 'redux-saga/effects'

import constants from './constants'
import actions from './actions'
import enquirySelectors from 'services/enquiry/selectors'
import {
  callSaga as enquiryCallSaga,
  callSagaDocs as docsCallSaga,
} from 'services/enquiry/call'
import { callSaga as spaceCallSaga } from 'services/space/call'
import { callSaga as appointmentCallSaga } from 'services/appointment/call'
import { EnquiryScreenAction, EnquiryScreenStateData } from './types'
import spaceActions from 'services/space/actions'
import negotiation from 'services/negotiation/actions'

export function* getEnquirySaga(action: EnquiryScreenAction) {
  try {
    let enquiryId
    const payload = action.payload as EnquiryScreenStateData
    const { id } = payload
    enquiryId = yield select(enquirySelectors.getEnquiryId)
    if (!enquiryId || id !== enquiryId) {
      const enquiryError = yield call(enquiryCallSaga, id)
      if (enquiryError) {
        return yield put(actions.getError('problem fetching enquiry'))
      }
      enquiryId = yield select(enquirySelectors.getEnquiryId)
      if (!enquiryId) {
        return yield put(actions.getError('problem selecting enquiry'))
      }
    }
    const spaceId = yield select(enquirySelectors.getSpaceId)
    const [spaceError, appointmentError] = yield all([
      call(spaceCallSaga),
      call(appointmentCallSaga),
      call(docsCallSaga, enquiryId),
      put(spaceActions.getSelectedSpace(spaceId)),
      put(negotiation.get()),
    ])
    if (spaceError) {
      return yield put(actions.getError('problem fetching space'))
    }
    if (appointmentError) {
      return yield put(actions.getError('problem fetching appointments'))
    }
  } catch (e) {
    yield put(actions.getError(e.message))
  }
}
function* saga() {
  yield takeLatest(constants.GET, getEnquirySaga)
}

export default saga
