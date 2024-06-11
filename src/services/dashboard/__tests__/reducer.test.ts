import reducer from '../reducer'
import actions from '../actions'
import { DashboardState } from '../types'

const initialState: DashboardState = {
  initOK: false,
  buildings: [],
  spaces: {},
  isLoading: false,
  pendingDelete: [],
}

describe('Dashboard init', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('dashboard init success', () => {
    const okState = { ...initialState, initOK: true, isLoading: false }
    const state = reducer(
      initialState,
      actions.dashboardSuccess({ buildings: [], spaces: {} }),
    )
    expect(state).toEqual(okState)
  })

  it('dashboard init error', () => {
    const state = reducer(undefined, actions.dashboardError('Error1'))
    expect(state.error).toEqual('Error1')
  })

  it('dashboard pending delete', () => {
    const state = reducer(undefined, actions.pendingSpaceDelete('SS_SPACE_01'))
    expect(state.pendingDelete).toEqual(['SS_SPACE_01'])
  })
})
