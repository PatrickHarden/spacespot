import constants from './constants'
import {
  EnquiryState,
  EnquiryAction,
  EnquiryResponse,
  DocumentDTO,
} from './types'

const initialState: EnquiryState = {}

const reduceDocTypeSuccess = (
  state: EnquiryState = initialState,
  action: EnquiryAction,
): EnquiryState => {
  const doc = action.payload as DocumentDTO
  const docType = doc.documentType
  const prev = state.docs
    ? state.docs.filter(
        doc => !doc.documentType || doc.documentType !== docType,
      )
    : []
  return {
    ...state,
    docs: [...prev, doc],
  }
}

const reducer = (
  state: EnquiryState = initialState,
  action: EnquiryAction,
): EnquiryState => {
  switch (action.type) {
    case constants.INIT:
    case constants.GET:
      return { ...initialState }
    case constants.INIT_ERROR:
    case constants.GET_ERROR:
    case constants.GET_DOCS_ERROR:
    case constants.GET_DOC_ERROR:
    case constants.PUT_DOC_ERROR:
    case constants.DELETE_DOC_ERROR:
      return { ...state, error: action.payload as string }
    case constants.INIT_SUCCESS:
    case constants.GET_SUCCESS:
      return { ...state, data: action.payload as EnquiryResponse }
    case constants.GET_DOCS_SUCCESS:
      return { ...state, docs: action.payload as Array<DocumentDTO> }
    case constants.PUT_DOC_SUCCESS:
      return {
        ...state,
        docs: state.docs
          ? [...state.docs, action.payload as DocumentDTO]
          : [action.payload as DocumentDTO],
      }
    case constants.PUT_DOC_TYPE_SUCCESS:
      return reduceDocTypeSuccess(state, action)
    case constants.DELETE_DOC_SUCCESS:
      return {
        ...state,
        docs: state.docs
          ? state.docs.filter(doc => doc.fileId !== action.payload)
          : [],
      }
    default:
      return state
  }
}
export default reducer
