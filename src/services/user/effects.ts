import { call, take, actionChannel, fork } from 'redux-saga/effects'

/**
 * Spawns saga that takes actions one by one
 *
 * @param pattern Pattern or action type
 * @param worker saga
 */
export const takeOneByOne = (
  pattern: string,
  worker: (action: any) => Generator<any>,
) => {
  return fork(function*() {
    const requestChan = yield actionChannel(pattern)
    while (true) {
      const action = yield take(requestChan)
      yield call(worker, action)
    }
  })
}
