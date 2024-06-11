import { get } from 'lodash'
import axios, { AxiosResponse, ResponseType } from 'axios'
import {
  NegotiationTermFields,
  NegotiationAPIResponse,
  FitoutOptionProps,
  SelectedFitoutOption,
  NegotiationStatusResponse,
  NegotiationStatus,
  SignerInfoDTO,
  SignerDetailDTO,
} from './types'
import CONFIG from 'config'

export const getNegotiationTerms = async (
  token: string,
  enquiryId: string,
): Promise<NegotiationAPIResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/negotiations`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<NegotiationAPIResponse> = await axios.get(
    url,
    config,
  )
  return get(resp, 'data')
}

export const getNegotiationTermsFields = async (
  token: string,
): Promise<NegotiationTermFields> => {
  const url = `${CONFIG.API_HOST}/negotiations/terms/fields`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<NegotiationTermFields> = await axios.get(
    url,
    token ? config : undefined,
  )
  return get(resp, 'data')
}

export const putCounterNegotiationTerms = async (
  token: string,
  enquiryId: number,
  data: NegotiationAPIResponse,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/negotiation/counter`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.post(url, data, config)
  return get(resp, 'data')
}

export const acceptNegotiationTerms = async (
  token: string,
  enquiryId: number,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/negotiation/accept`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, config)
  return get(resp, 'data')
}

export const rejectNegotiationTerms = async (
  token: string,
  enquiryId: number,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/negotiation/reject`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, config)
  return get(resp, 'data')
}

export const getCustomFitout = async (
  token: string,
  negotiationId: number,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/negotiations/${negotiationId}/customfitoutoptions`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.get(url, config)
  return get(resp, 'data')
}

export const putCustomFitout = async (
  token: string,
  negotiationId: number,
  data: FitoutOptionProps,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/negotiations/${negotiationId}/customfitoutoptions`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.post(url, data, config)
  return get(resp, 'data')
}

export const saveSpecialProvision = async (
  token: string,
  enquiryId: number,
  data: string,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/negotiation/specialprovision`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, data, config)
  return get(resp, 'data')
}

export const acceptSpecialProvision = async (
  token: string,
  negotiationId: number,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/negotiations/${negotiationId}/specialprovision/accept`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, null, config)
  return get(resp, 'data')
}

export const rejectSpecialProvision = async (
  token: string,
  negotiationId: number,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/negotiations/${negotiationId}/specialprovision/reject`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, null, config)
  return get(resp, 'data')
}

export const selectFitoutAPI = async (
  token: string,
  negotiationId: string,
  data: SelectedFitoutOption,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/negotiations/${negotiationId}/selectfitout`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, data, config)
  return get(resp, 'data')
}

export const deleteFitoutAPI = async (
  token: string,
  negotiationId: string,
  fitoutId: string,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/negotiations/${negotiationId}/customfitoutoptions/${fitoutId}`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.delete(url, config)
  return get(resp, 'data')
}

export const getNegotiationStatus = async (
  token: string,
  negotiationId: string,
): Promise<NegotiationStatusResponse> => {
  const url = `${CONFIG.API_HOST}/signlease/${negotiationId}/status`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<NegotiationStatusResponse> = await axios.get(
    url,
    config,
  )
  return get(resp, 'data')
}

export const putSignLeaseStatusAPI = async (
  token: string,
  negotiationId: string,
  data: { signLeaseStatus: NegotiationStatus },
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/signlease/negotiations/${negotiationId}/status`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, data, config)
  return get(resp, 'data')
}

export const postSignerInfo = async (
  token: string,
  negotiationId: string,
  data: SignerInfoDTO,
): Promise<SignerInfoDTO> => {
  const url = `${CONFIG.API_HOST}/signlease/negotiations/${negotiationId}/signerinfo`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.post(url, data, config)
  return get(resp, 'data')
}

export const putSignerInfo = async (
  token: string,
  data: SignerInfoDTO,
): Promise<SignerInfoDTO> => {
  const id = data.id
  const url = `${CONFIG.API_HOST}/signlease/signerinfo/${id}`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.put(url, data, config)
  return get(resp, 'data')
}

export const getSignerInfo = async (
  token: string,
  negotiationId: string,
): Promise<SignerInfoDTO> => {
  const url = `${CONFIG.API_HOST}/signlease/negotiations/${negotiationId}/signerinfo`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.get(url, config)
  return get(resp, 'data')
}

export const getSigners = async (
  token: string,
  negotiationId: string,
): Promise<Array<SignerDetailDTO>> => {
  const url = `${CONFIG.API_HOST}/documentsign/negotiations/${negotiationId}/signers`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.get(url, config)
  return get(resp, 'data')
}

export const acceptLease = async (
  token: string,
  negotiationId: string,
): Promise<SignerInfoDTO> => {
  const url = `${CONFIG.API_HOST}/signlease/negotiations/${negotiationId}/acceptlease`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<any> = await axios.post(url, config)
  return get(resp, 'data')
}

export const finalSign = async (
  token: string,
  enquiryId: string,
): Promise<SignerInfoDTO> => {
  const url = `${CONFIG.API_HOST}/signlease/enquiries/${enquiryId}/finalsignprocess`
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      culture: 'default',
    },
  }
  const resp: AxiosResponse<any> = await axios.get(url, config)
  return get(resp, 'data')
}

export const getPreviewLeaseSagaAPI = async (
  token: string,
  enquireId: string,
  data: { culture: string },
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/signlease/enquiries/${enquireId}/previewlease`
  const config = {
    responseType: 'arraybuffer' as ResponseType,
    headers: {
      Authorization: `Bearer ${token}`,
      ...data,
    },
  }
  const resp: AxiosResponse<any> = await axios.get(url, config)
  return get(resp, 'data')
}

export const getLeaseDocument = async (
  token: string,
  negotiationId: string,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/documentsign/negotiations/${negotiationId}/download`
  const config = {
    responseType: 'arraybuffer' as ResponseType,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const resp: AxiosResponse<any> = await axios.get(url, config)
  return get(resp, 'data')
}
