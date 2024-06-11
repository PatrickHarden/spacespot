import { get } from 'lodash'
import { SpacespotState } from '../global/types'
import { DocumentDTO, EnquiryResponse, DOC_TYPE_TEMPLATE } from './types'
import selectorsUser from '../user/selectors'

const getEnquiry = (state: SpacespotState): EnquiryResponse =>
  get(state, 'enquiry.data')
const getSpaceId = (state: SpacespotState) => get(getEnquiry(state), 'spaceId')
const getChatId = (state: SpacespotState) => get(getEnquiry(state), 'chatId')
const getEnquiryId = (state: SpacespotState) =>
  get(getEnquiry(state), 'enquireId')

const getError = (state: SpacespotState) => get(state, 'enquiry.error')
const getDocs = (state: SpacespotState) => {
  const docs = get(state, 'enquiry.docs')
  const userId = selectorsUser.accountIdentifier(state)
  return docs && docs.length > 0
    ? docs.map((doc: DocumentDTO) => ({
        ...doc,
        isMine: userId === doc.uploadedBy,
      }))
    : []
}

const getLeaseTemplate = (state: SpacespotState) => {
  const docs = get(state, 'enquiry.docs')
  const temps =
    docs && docs.length > 0
      ? docs.filter(
          (doc: DocumentDTO) =>
            doc.documentType && doc.documentType === DOC_TYPE_TEMPLATE,
        )
      : []
  return temps.length > 0 ? temps[0] : undefined
}

export default {
  getEnquiry,
  getSpaceId,
  getChatId,
  getEnquiryId,
  getError,
  getDocs,
  getLeaseTemplate,
}
