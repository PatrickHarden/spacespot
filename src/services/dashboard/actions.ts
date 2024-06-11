import constants from './constants'
import { Space } from 'services/space/types'

const dashboardInit = () => ({
  type: constants.DASHBOARD_INIT,
})

const dashboardSuccess = (payload: {
  buildings: Array<Space>
  spaces: { [key: string]: Array<Space> }
}) => ({
  type: constants.DASHBOARD_SUCCESS,
  payload,
})

const dashboardError = (payload: string) => ({
  type: constants.DASHBOARD_ERROR,
  payload,
})

const pendingSpaceDelete = (payload: string) => ({
  type: constants.DASHBOARD_PENDING_SPACE_DELETE,
  payload,
})

export default {
  dashboardInit,
  dashboardSuccess,
  dashboardError,
  pendingSpaceDelete,
}
