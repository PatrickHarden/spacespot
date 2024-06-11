import { get } from 'lodash'
import constants from './constants'
import { NegotiationState, FitoutOptionProps } from './types'

const initialState: NegotiationState = { data: undefined, loading: false }
const filterCustomFitout = (fitouts: Array<FitoutOptionProps>, id: string) =>
  fitouts.filter((fitout: FitoutOptionProps) => fitout.id !== id)

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case constants.GET:
      return { ...state, loading: true }
    case constants.GET_ERROR:
    case constants.GET_FIELDS_ERROR:
      return { error: action.payload as string, loading: false }
    case constants.GET_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        signers: undefined,
        signerInfo: undefined,
      }
    case constants.GET_FIELDS_SUCCESS:
      return {
        ...state,
        termsFields: action.payload,
        loading: false,
      }
    case constants.SELECT_FITOUT_SUCCESS:
    case constants.PUT_SIGN_LEASE_STATUS_SUCCESS:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      }
    case constants.GET_CUSTOM_FITOUT_SUCCESS:
      return {
        ...state,
        customFitout: action.payload,
        loading: false,
      }

    case constants.PUT_CUSTOM_FITOUT_SUCCESS:
      return {
        ...state,
        customFitout: [...get(state, 'customFitout', []), action.payload],
        loading: false,
      }

    case constants.DELETE_FITOUT_SUCCESS:
      return {
        ...state,
        customFitout: filterCustomFitout(
          get(state, 'customFitout', []),
          action.payload,
        ),
      }
    case constants.SIGNER_INFO_SUCCESS:
      return {
        ...state,
        signerInfo: action.payload,
      }
    case constants.SIGNERS_SUCCESS:
      return {
        ...state,
        signers: action.payload,
      }
    case constants.SIGNERS_ERROR:
      return {
        ...state,
        signers: undefined,
        error: action.payload as string,
      }
    case constants.SIGNER_INFO_ERROR:
      return {
        ...state,
        signerInfo: undefined,
        error: action.payload as string,
      }
    default:
      return state
  }
}

export default reducer
