export interface EnquiryScreenAction {
  type: string
  payload: EnquiryScreenStateData | string
}
export interface EnquiryScreenState {
  data?: EnquiryScreenStateData
  error?: string
}
export interface EnquiryScreenStateData {
  id: string
}
