import React from 'react'
import { get } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import userSelectors from 'services/user/selectors'
import {
  TermStatus,
  SpecialProvisionStatus,
  NegotiationStatus,
} from 'services/negotiation/types'
import actions from 'services/negotiation/actions'
import negotiationSelectors from 'services/negotiation/selectors'

const TextResult = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  padding-top: 10px;
`
const ButtonAccept = styled.button<{ isMobile?: boolean }>`
  width: ${props => (props.isMobile ? '33%' : '100%')};
  padding: 10px;
  border-radius: 2px;
  background-color: #404042;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  text-transform: uppercase;
  cursor: pointer;
`

const SummaryButton = (props: { isMobile?: boolean }) => {
  const { isMobile } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const isLandlord = useSelector(userSelectors.isLandlord)
  const negotiation = useSelector(negotiationSelectors.getNegotiation)
  const negotiationStatus = useSelector(
    negotiationSelectors.getNegotiationStatus,
  )
  const canSign = negotiationStatus === NegotiationStatus.TermsAgreed
  const specialProvisions = get(negotiation, 'specialProvision', '')
  const provStatus = specialProvisions
    ? get(negotiation, 'specialProvisionStatus')
    : SpecialProvisionStatus.Accepted

  const dispatch = useDispatch()
  const onClick = () => {
    dispatch(actions.putNegotiationStatus(NegotiationStatus.PreviewStart))
  }

  if (!negotiation) return <div></div>

  let text = ''
  if (negotiation.status === TermStatus.Created) {
    text = t('SUMMARY_TEXT_TENANT_ACCEPT')
  } else if (negotiation.status !== TermStatus.Accepted) {
    text = isMobile
      ? t('SUMMARY_TEXT_TENANT_WAITING_MOBILE')
      : t('SUMMARY_TEXT_TENANT_WAITING')
  } else if (provStatus !== SpecialProvisionStatus.Accepted) {
    text = isMobile
      ? t('SUMMARY_TEXT_TENANT_PROVISIONS_MOBILE')
      : t('SUMMARY_TEXT_TENANT_PROVISIONS')
  }

  if (canSign) {
    return (
      <ButtonAccept isMobile={isMobile} onClick={onClick}>
        {t('SUMMARY_CTA_PREVIEW')}
      </ButtonAccept>
    )
  }
  if (isLandlord) {
    return (
      <TextResult>
        {negotiation.status === TermStatus.Created
          ? t('SUMMARY_TEXT_LANDLORD_SUBMIT_TERMS')
          : t(
              isMobile
                ? 'SUMMARY_TEXT_LANDLORD_SUBMIT_TERMS_MOBILE'
                : 'SUMMARY_TEXT_LANDLORD_SUBMIT_TERMS',
            )}
      </TextResult>
    )
  }
  return <TextResult>{text}</TextResult>
}
export default SummaryButton
