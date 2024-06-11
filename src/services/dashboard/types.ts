import { Space } from 'services/space/types'

export interface DashboardState {
  buildings: Array<Space>
  spaces: { [key: string]: Array<Space> }
  error?: string
  isLoading: boolean
  initOK: boolean
  pendingDelete: Array<string>
}
