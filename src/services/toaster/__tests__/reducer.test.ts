import reducer from '../reducer'
import actions from '../actions'
import MockDate from 'mockdate'

describe('Toaster reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      messages: [],
    })
  })
  it('init should update state', () => {
    MockDate.set(1434319925275)
    expect(reducer(undefined, actions.showInfo('test'))).toEqual({
      messages: [
        {
          maxTime: 1434319930275,
          message: 'test',
          type: 'info',
        },
      ],
    })
  })

  it('error should update state', () => {
    expect(reducer(undefined, actions.showSuccess('test'))).toEqual({
      messages: [
        {
          maxTime: 1434319930275,
          message: 'test',
          type: 'success',
        },
      ],
    })
  })

  it('get success should update state', () => {
    expect(reducer(undefined, actions.showError('Error1'))).toEqual({
      messages: [
        {
          maxTime: 1434319930275,
          message: 'Error1',
          type: 'error',
        },
      ],
    })
  })
  MockDate.reset()
})
