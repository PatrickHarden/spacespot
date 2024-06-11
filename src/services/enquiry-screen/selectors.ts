import { get } from 'lodash'
import { SpacespotState } from '../global/types'

const getId = (state: SpacespotState) => get(state, 'enquiryscreen.data.id')
const getError = (state: SpacespotState): string =>
  get(state, 'enquiryscreen.error')

export default {
  getId,
  getError,
}
