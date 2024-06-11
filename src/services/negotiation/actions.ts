import types from './constants'
import {
  NegotiationAPIResponse,
  NegotiationTerm,
  FitoutOptionProps,
  SelectedFitoutOption,
  NegotiationStatus,
  NegotiationStatusResponse,
  SignerInfoDTO,
  SignerDetailDTO,
} from './types'

const get = () => ({
  type: types.GET,
})

const getSuccess = (payload: NegotiationAPIResponse) => ({
  type: types.GET_SUCCESS,
  payload,
})

const getError = (payload: string) => ({
  type: types.GET_ERROR,
  payload,
})

const getFields = () => ({
  type: types.GET_FIELDS,
})

const getFieldsSuccess = (payload: any) => ({
  type: types.GET_FIELDS_SUCCESS,
  payload,
})

const getFieldsError = (payload: string) => ({
  type: types.GET_FIELDS_ERROR,
  payload,
})

const putCounter = (payload: Array<NegotiationTerm>) => ({
  type: types.PUT_COUNTER,
  payload,
})

const putCounterSuccess = (payload: any) => ({
  type: types.PUT_COUNTER_SUCCESS,
  payload,
})

const putCounterError = (payload: string) => ({
  type: types.PUT_COUNTER_ERROR,
  payload,
})

const accept = () => ({
  type: types.ACCEPT,
})
const acceptSuccess = (payload: any): any => ({
  type: types.ACCEPT_SUCCESS,
  payload,
})
const acceptError = (payload: string): any => ({
  type: types.ACCEPT_ERROR,
  payload,
})

const reject = () => ({
  type: types.REJECT,
})
const rejectSuccess = (payload: any): any => ({
  type: types.REJECT_SUCCESS,
  payload,
})
const rejectError = (payload: string): any => ({
  type: types.REJECT_ERROR,
  payload,
})

const getCustomFitout = () => ({
  type: types.GET_CUSTOM_FITOUT,
})

const getCustomFitoutSuccess = (payload: any) => ({
  type: types.GET_CUSTOM_FITOUT_SUCCESS,
  payload,
})

const getCustomFitoutError = (payload: string) => ({
  type: types.GET_CUSTOM_FITOUT_ERROR,
  payload,
})

const putCustomFitout = (payload: FitoutOptionProps) => ({
  type: types.PUT_CUSTOM_FITOUT,
  payload,
})

const putCustomFitoutSuccess = (payload: any) => ({
  type: types.PUT_CUSTOM_FITOUT_SUCCESS,
  payload,
})

const putCustomFitoutError = (payload: string) => ({
  type: types.PUT_CUSTOM_FITOUT_ERROR,
  payload,
})

const saveSpecialProvisions = (payload: string) => ({
  type: types.SAVE_SPECIAL_PROVISIONS,
  payload,
})

const saveSpecialProvisionsSuccess = () => ({
  type: types.SAVE_SPECIAL_PROVISIONS_SUCCESS,
})

const saveSpecialProvisionsError = (payload: string) => ({
  type: types.SAVE_SPECIAL_PROVISIONS_ERROR,
  payload,
})

const acceptSpecialProvisions = () => ({
  type: types.ACCEPT_SPECIAL_PROVISIONS,
})

const rejectSpecialProvisions = () => ({
  type: types.REJECT_SPECIAL_PROVISIONS,
})

const selectFitout = (payload: SelectedFitoutOption) => ({
  type: types.SELECT_FITOUT,
  payload,
})
const selectFitoutSuccess = (payload: NegotiationAPIResponse) => ({
  type: types.SELECT_FITOUT_SUCCESS,
  payload,
})
const selectFitoutError = (payload: string) => ({
  type: types.SELECT_FITOUT_ERROR,
  payload,
})
const deleteFitout = (payload: string) => ({
  type: types.DELETE_FITOUT,
  payload,
})
const deleteFitoutSuccess = (payload: string) => ({
  type: types.DELETE_FITOUT_SUCCESS,
  payload,
})
const deleteFitoutError = (payload: string) => ({
  type: types.DELETE_FITOUT_ERROR,
  payload,
})
const putNegotiationStatus = (payload: NegotiationStatus) => ({
  type: types.PUT_SIGN_LEASE_STATUS,
  payload,
})
const putNegotiationStatusSuccess = (payload: NegotiationStatusResponse) => ({
  type: types.PUT_SIGN_LEASE_STATUS_SUCCESS,
  payload,
})
const putNegotiationStatusError = (payload: string) => ({
  type: types.PUT_SIGN_LEASE_STATUS_ERROR,
  payload,
})

const postSignerInfo = (payload: SignerInfoDTO) => ({
  type: types.POST_SIGNER_INFO,
  payload,
})
const putSignerInfo = (payload: SignerInfoDTO) => ({
  type: types.PUT_SIGNER_INFO,
  payload,
})
const getSignerInfo = () => ({
  type: types.GET_SIGNER_INFO,
})
const signerInfoSuccess = (payload: SignerInfoDTO) => ({
  type: types.SIGNER_INFO_SUCCESS,
  payload,
})
const signerInfoError = (payload: string) => ({
  type: types.SIGNER_INFO_ERROR,
  payload,
})
const acceptLease = () => ({
  type: types.ACCEPT_LEASE,
})

const getSigners = () => ({
  type: types.SIGNERS,
})
const signersSuccess = (payload: Array<SignerDetailDTO>) => ({
  type: types.SIGNERS_SUCCESS,
  payload,
})
const signersError = (payload: string) => ({
  type: types.SIGNERS_ERROR,
  payload,
})

const getPreviewLease = () => ({
  type: types.GET_PREVIEW_LEASE,
})
const getPreviewLeaseSuccess = (payload: NegotiationStatusResponse) => ({
  type: types.GET_PREVIEW_LEASE_SUCCESS,
  payload,
})
const getPreviewLeaseError = (payload: string) => ({
  type: types.GET_PREVIEW_LEASE_ERROR,
  payload,
})

const getLeaseDocument = () => ({
  type: types.GET_LEASE_DOC,
})

export default {
  get,
  getSuccess,
  getError,
  getFields,
  getFieldsSuccess,
  getFieldsError,
  putCounter,
  putCounterSuccess,
  putCounterError,
  accept,
  acceptSuccess,
  acceptError,
  reject,
  rejectSuccess,
  rejectError,
  getCustomFitout,
  getCustomFitoutSuccess,
  getCustomFitoutError,
  putCustomFitout,
  putCustomFitoutSuccess,
  putCustomFitoutError,
  saveSpecialProvisions,
  saveSpecialProvisionsSuccess,
  saveSpecialProvisionsError,
  acceptSpecialProvisions,
  rejectSpecialProvisions,
  selectFitout,
  selectFitoutSuccess,
  selectFitoutError,
  deleteFitout,
  deleteFitoutSuccess,
  deleteFitoutError,
  putNegotiationStatus,
  putNegotiationStatusSuccess,
  putNegotiationStatusError,
  postSignerInfo,
  putSignerInfo,
  getSignerInfo,
  signerInfoSuccess,
  signerInfoError,
  acceptLease,
  getSigners,
  signersSuccess,
  signersError,
  getPreviewLease,
  getPreviewLeaseSuccess,
  getPreviewLeaseError,
  getLeaseDocument,
}
