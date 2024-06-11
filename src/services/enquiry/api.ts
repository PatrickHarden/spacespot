import axios, { AxiosResponse } from 'axios'
import CONFIG from 'config'
import { EnquiryResponse, DocumentDTO, EnquiryRequest } from './types'
import { FileItem } from 'services/global/types'
import { dataURItoBlob } from 'services/global/util'

export const initEnquiry = async (
  token: string,
  request: EnquiryRequest,
): Promise<EnquiryResponse> => {
  const url = request.loggedIn
    ? `${CONFIG.API_HOST}/enquiries`
    : `${CONFIG.API_HOST}/enquiries/v2`
  const config = {
    headers: {
      Authorization: request.loggedIn
        ? `Bearer ${token}`
        : 'U1BBQ0VTUE9UU1VCTUlURU5RVUlSWQ==',
    },
  }
  delete request.loggedIn // remove client-side specific property before going to API
  const resp: AxiosResponse<EnquiryResponse> = await axios.post(
    url,
    request,
    config,
  )
  return resp.data
}

export const getEnquiry = async (
  enquiryId: string,
  token: string,
): Promise<EnquiryResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<EnquiryResponse> = await axios.get(url, config)
  return resp.data
}

export const putDocument = async (
  doc: FileItem,
  enquiryId: number,
  token: string,
): Promise<DocumentDTO> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/documents`
  const formData = new FormData()
  formData.append('file', dataURItoBlob(doc.uri), doc.name)
  const resp: AxiosResponse<DocumentDTO> = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return resp.data
}

export const putDocumentType = async (
  doc: FileItem,
  enquiryId: number,
  token: string,
  docType: string,
): Promise<DocumentDTO> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/documents`
  const formData = new FormData()
  formData.append('documentType', docType)
  formData.append('file', dataURItoBlob(doc.uri), doc.name)
  const resp: AxiosResponse<DocumentDTO> = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return resp.data
}

export const getStandardTemplate = async (token: string): Promise<any> => {
  const url = `${CONFIG.API_HOST}/leasedocuments/standardtemplate/download`
  const resp: AxiosResponse<any> = await axios.get(url, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
      culture: 'default',
    },
  })
  return resp.data
}

export const getDocument = async (
  docId: number,
  enquiryId: number,
  token: string,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/documents/${docId}`
  const resp: AxiosResponse<any> = await axios.get(url, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return resp.data
}

export const deleteDocument = async (
  docId: number,
  enquiryId: number,
  token: string,
): Promise<any> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/documents/${docId}`
  const resp: AxiosResponse<any> = await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return resp.data
}

export const getDocuments = async (
  enquiryId: number,
  token: string,
): Promise<Array<DocumentDTO>> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/documents`
  const resp: AxiosResponse<Array<DocumentDTO>> = await axios.get(url, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  return resp.data
}

export const acceptEnquiry = async (
  enquiryId: string,
  token: string,
): Promise<EnquiryResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/accept`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<EnquiryResponse> = await axios.post(url, config)
  return resp.data
}

export const resetNotifications = async (
  enquiryId: number,
  token: string,
): Promise<EnquiryResponse> => {
  const url = `${CONFIG.API_HOST}/enquiries/${enquiryId}/notifications`
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const resp: AxiosResponse<EnquiryResponse> = await axios.put(url, config)
  return resp.data
}
