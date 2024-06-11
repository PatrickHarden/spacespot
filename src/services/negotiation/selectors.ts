/* eslint-disable no-unused-vars */
import { get } from 'lodash'
import { SpacespotState } from '../global/types'
import {
  NegotiationTerm,
  NegotiationTerms,
  NegotiationTermFields,
  NegotiationAPIResponse,
  SelectedFitoutOption,
  TermStatus,
  NegotiationTermFieldsIds,
  NegotiationStatus,
  SpecialProvisionStatus,
  SignerInfoDTO,
  SignerDetailDTO,
} from './types'

import { getFields } from './helpers'
import userSelectors from 'services/user/selectors'

const getTerms = (state: SpacespotState): Array<NegotiationTerm> =>
  get(state, 'negotiation.data.terms')

const getStatus = (state: SpacespotState): TermStatus =>
  get(state, 'negotiation.data.status')

const getNegotiationId = (state: SpacespotState): number =>
  get(state, 'negotiation.data.negotiationId')

const getNegotiationFields = (state: SpacespotState): NegotiationTermFields =>
  get(state, 'negotiation.termsFields')

const getNegotiation = (state: SpacespotState): NegotiationAPIResponse =>
  get(state, 'negotiation.data')

const getNegotiationSpecialProvisions = (state: SpacespotState): string =>
  get(getNegotiation(state), 'specialProvision', '')

const decapitalize = (title: string) => title[0].toLowerCase() + title.slice(1)

// FIXME should return undefined if no data loaded to trigger the action
const getNegotiationTerms = (state: SpacespotState): NegotiationTerms => {
  const negTerms = getTerms(state)
  const fields = getNegotiationFields(state)
  const terms = getFields(fields, negTerms)
  return terms
}

const getNegotiationFieldIds = (state: SpacespotState) => {
  const fields = getNegotiationFields(state)
  return (
    fields &&
    Object.keys(fields).reduce((acc, ix) => {
      const i = Number(ix)
      const val = decapitalize(fields[i])
      acc[val] = i
      return acc
    }, {} as NegotiationTermFieldsIds)
  )
}

// FIXME should return undefined if no data loaded to trigger the action
const getNegotiationFitout = (
  state: SpacespotState,
): SelectedFitoutOption | undefined => {
  const fitoutSelected = get(state, 'negotiation.data.fitoutOption')
  if (fitoutSelected === 0) {
    return undefined
  }
  return {
    custom: get(state, 'negotiation.data.customFitout'),
    fitoutOption: fitoutSelected,
  }
}
const getSpecialProvisionStatus = (state: SpacespotState) =>
  get(getNegotiation(state), 'specialProvisionStatus')

const getNegotiationStatus = (state: SpacespotState): NegotiationStatus => {
  const variableName = userSelectors.isLandlord(state)
    ? 'peer2SignLeaseStatus'
    : 'peer1SignLeaseStatus'
  let status = get(getNegotiation(state), variableName)
  if (!status) {
    status =
      getStatus(state) === 'ACCEPTED'
        ? NegotiationStatus.TermsAgreed
        : NegotiationStatus.TermsNotAgreed
  }
  if (status !== NegotiationStatus.TermsAgreed) return status

  const prov = getNegotiationSpecialProvisions(state)
  const provStatus =
    prov && prov !== ''
      ? getSpecialProvisionStatus(state)
      : SpecialProvisionStatus.Accepted

  return provStatus === SpecialProvisionStatus.Accepted
    ? NegotiationStatus.TermsAgreed
    : NegotiationStatus.TermsNotAgreed
}

const getNegotiationPeerStatus = (state: SpacespotState): NegotiationStatus => {
  const variableName = userSelectors.isLandlord(state)
    ? 'peer1SignLeaseStatus'
    : 'peer2SignLeaseStatus'
  const status = get(getNegotiation(state), variableName)
  if (status) {
    return status
  }
  return NegotiationStatus.TermsNotAgreed
}

const getCustomFitout = (
  state: SpacespotState,
): SelectedFitoutOption | undefined => {
  return get(state, 'negotiation.data.customFitout')
}

const getSignerInfo = (state: SpacespotState): SignerInfoDTO | undefined => {
  return get(state, 'negotiation.signerInfo')
}

const getSigners = (
  state: SpacespotState,
): Array<SignerDetailDTO> | undefined => {
  return get(state, 'negotiation.signers')
}

// FIXME in the future we will get the document template Id here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDocumentCulture = (_state: SpacespotState): string => {
  return 'default'
}

export default {
  getNegotiationTerms,
  getTerms,
  getStatus,
  getNegotiation,
  getNegotiationStatus,
  getNegotiationPeerStatus,
  getNegotiationId,
  getNegotiationFields,
  getNegotiationFieldIds,
  getNegotiationFitout,
  getNegotiationSpecialProvisions,
  getCustomFitout,
  getSignerInfo,
  getSigners,
  getDocumentCulture,
}
