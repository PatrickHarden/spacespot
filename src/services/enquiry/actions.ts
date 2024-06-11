import {
  EnquiryAction,
  EnquiryResponse,
  DocumentDTO,
  DocData,
  EnquiryRequest,
  EnquiryRequestFlex,
} from './types'
import { FileItem } from 'services/global/types'
import constants from './constants'

const init = (payload: EnquiryRequest | EnquiryRequestFlex) => ({
  type: constants.INIT,
  payload,
})

const initSuccess = (payload: EnquiryResponse): EnquiryAction => ({
  type: constants.INIT_SUCCESS,
  payload,
})

const initError = (payload: string): EnquiryAction => ({
  type: constants.INIT_ERROR,
  payload,
})

const get = (payload: string): EnquiryAction => ({
  type: constants.GET,
  payload,
})

const getSuccess = (payload: EnquiryResponse): EnquiryAction => ({
  type: constants.GET_SUCCESS,
  payload,
})

const getError = (payload: string): EnquiryAction => ({
  type: constants.GET_ERROR,
  payload,
})

const getDocs = (payload: number): EnquiryAction => ({
  type: constants.GET_DOCS,
  payload,
})

const getDocsSuccess = (payload: Array<DocumentDTO>): EnquiryAction => ({
  type: constants.GET_DOCS_SUCCESS,
  payload,
})

const getDocsError = (payload: string): EnquiryAction => ({
  type: constants.GET_DOCS_ERROR,
  payload,
})
const updateDocs = (payload: number): EnquiryAction => ({
  type: constants.UPDATE_DOCS,
  payload,
})

const putDocType = (item: FileItem, docType: string): EnquiryAction => ({
  type: constants.PUT_DOC_TYPE,
  payload: {
    item: item,
    docType: docType,
  },
})

const putDocTypeSuccess = (payload: DocumentDTO): EnquiryAction => ({
  type: constants.PUT_DOC_TYPE_SUCCESS,
  payload,
})

const putDoc = (payload: FileItem): EnquiryAction => ({
  type: constants.PUT_DOC,
  payload,
})

const putDocSuccess = (payload: DocumentDTO): EnquiryAction => ({
  type: constants.PUT_DOC_SUCCESS,
  payload,
})

const putDocError = (payload: string): EnquiryAction => ({
  type: constants.PUT_DOC_ERROR,
  payload,
})

const getDoc = (payload: DocumentDTO): EnquiryAction => ({
  type: constants.GET_DOC,
  payload,
})

const getStdTemplate = (): EnquiryAction => ({
  type: constants.GET_STD_TEMPLATE,
  payload: null,
})

const getDocSuccess = (payload: DocData): EnquiryAction => ({
  type: constants.GET_DOC_SUCCESS,
  payload,
})

const getDocError = (payload: string): EnquiryAction => ({
  type: constants.GET_DOC_ERROR,
  payload,
})

const deleteDoc = (payload: number): EnquiryAction => ({
  type: constants.DELETE_DOC,
  payload,
})

const deleteDocSuccess = (payload: number): EnquiryAction => ({
  type: constants.DELETE_DOC_SUCCESS,
  payload,
})

const deleteDocError = (payload: string): EnquiryAction => ({
  type: constants.DELETE_DOC_ERROR,
  payload,
})

const resetNotifications = (payload: number): EnquiryAction => ({
  type: constants.RESET_NOTIFICATIONS,
  payload,
})

export default {
  init,
  initSuccess,
  initError,
  get,
  getSuccess,
  getError,
  getDocs,
  getDocsSuccess,
  getDocsError,
  updateDocs,
  putDoc,
  putDocSuccess,
  putDocType,
  putDocTypeSuccess,
  putDocError,
  getDoc,
  getStdTemplate,
  getDocSuccess,
  getDocError,
  deleteDoc,
  deleteDocSuccess,
  deleteDocError,
  resetNotifications,
}
