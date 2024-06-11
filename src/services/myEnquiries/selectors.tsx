import { get } from 'lodash'
import { SpacespotState } from '../global/types'
import { MyEnquiriesAPIResponse } from './types'

const getMyEnquiries = (state: SpacespotState): Array<MyEnquiriesAPIResponse> =>
  get(state, 'myenquiries.data')

const getMyEnquiriesError = (state: SpacespotState): string =>
  get(state, 'myenquiries.error')

const getMyEnquiriesLoading = (state: SpacespotState): boolean =>
  get(state, 'myenquiries.loading')

const getNotifications = (state: SpacespotState): number =>
  get(state, 'myenquiries.notifications')

export default {
  getMyEnquiries,
  getMyEnquiriesLoading,
  getMyEnquiriesError,
  getNotifications,
}
