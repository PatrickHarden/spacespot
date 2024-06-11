import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import negotiationSelectors from 'services/negotiation/selectors'
import actions from 'services/negotiation/actions'
import spaceSelector, { getCountry } from 'services/space/selectors'

import { getRegionCurrencyCode } from 'services/global/region'
import { formatCurrency } from 'services/global/util'
import { NegotiationStatus, PaymentType } from 'services/negotiation/types'
import Heading2 from 'components/common/Heading2'
import FilledButton from 'components/common/FilledButton'
import OutlinedButton from 'components/common/OutlinedButton'
import SummaryButton from './SummaryButton'
import device from 'services/global/device'
import SignStepper from './SignStepper'
import SignDetailsForm from './SignDetailsForm'
import SignDetails from './SignDetails'
import SignFooter from './SignFooter'
import LeaseAccepted from './LeaseAccepted'
import BothAccepted from './BothAccepted'

const Heading = styled(Heading2)`
  color: #000000;
  margin-top: 0;
  margin-bottom: 20px;
`

const Container = styled.div`
  position: sticky;
  top: 70px;
  margin-top: 66px;
  min-width: 250px;
  padding: 5px 0px 0 0px;
  box-sizing: border-box;
  border: 1px solid #dddddd;
  border-radius: 2px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  @media ${device.mobile} {
    box-shadow: none;
    border: none;
  }
`

const SummaryBlock = styled.div`
  padding: 0px 20px;
`

const ActionsBlock = styled.div`
  padding: 20px;
`

const Table = styled.div`
  display: flex;
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 300;
  line-height: 21px;
`
const TableSeparator = styled(Table)`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #cecece;
`
const Title = styled.div`
  width: 60%;
  font-weight: 400;
`
const Value = styled.div`
  width: 40%;
  text-align: right;
  font-weight: 400;
`
const SummaryTotal = styled.div`
  width: 50%;
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  line-height: 33px;
  text-align: left;
  padding-right: 10px;
`
const SummaryTotalValue = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  line-height: 33px;
  text-align: right;
  width: 50%;
`
const SummaryTotalLease = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
  width: 50%;
  padding-right: 5px;
`
const SummaryTotalLeaseValue = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  text-align: right;
  width: 50%;
`

const CanSignMsg = styled((props: { className?: string }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <div className={props.className}>
      <h5>{t('SUMMARY_AGREEMENT_TITLE')}</h5>
      <p>{t('SUMMARY_AGREEMENT_MSG')}</p>
    </div>
  )
})`
  margin-top: 25px;
  border-top: 1px solid #cecece;
  padding: 20px 0 0 0;
  h5 {
    font-size: 16px;
    margin: 0 0 5px 0;
    font-weight: 400;
  }
  p {
    margin-top: 0;
    font-weight: 400;
    color: #6d6c6c;
  }
`

const PreviewMsg = styled((props: { className?: string }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  return (
    <div className={props.className}>
      <p>{t('SUMMARY_PREVIEW_MSG')}</p>
      <FilledButton onClick={() => dispatch(actions.getPreviewLease())}>
        {t('SUMMARY_PREVIEW_CTA_PREVIEW')}
      </FilledButton>
    </div>
  )
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fafafa;
  padding: 1em 20px;
  margin-top: 25px;
  p {
    margin-top: 0;
    font-weight: 400;
  }
`

const PreviewButtons = styled((props: { className?: string }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const back = () => {
    dispatch(actions.putNegotiationStatus(NegotiationStatus.TermsAgreed))
  }
  const next = () => {
    dispatch(actions.putNegotiationStatus(NegotiationStatus.SignInfo))
  }
  return (
    <div className={props.className}>
      <FilledButton onClick={next}>{t('SUMMARY_CTA_CONTINUE')}</FilledButton>
      <OutlinedButton onClick={back}>
        {t('SUMMARY_CTA_BACK_NEGOTIATION')}
      </OutlinedButton>
    </div>
  )
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 0px;
  ${FilledButton} {
    width: 100%;
    background: #404042;
    margin-bottom: 5px;
  }
  ${OutlinedButton} {
    width: 100%;
    border: none;
    color: #404042;
    text-transform: none;
  }
`

const Summary = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const space = useSelector(spaceSelector.selectedSpace)
  const country = getCountry(space)
  const currencyCode = getRegionCurrencyCode(country)
  const negotiationTerms = useSelector(negotiationSelectors.getNegotiationTerms)
  const negStatus = useSelector(negotiationSelectors.getNegotiationStatus)
  const peerStatus = useSelector(negotiationSelectors.getNegotiationPeerStatus)
  const preview = negStatus === NegotiationStatus.PreviewStart

  const signing =
    negStatus === NegotiationStatus.SignInfo ||
    negStatus === NegotiationStatus.AcceptLease ||
    negStatus === NegotiationStatus.LeaseAccepted ||
    negStatus === NegotiationStatus.LeaseSignInitiated ||
    negStatus === NegotiationStatus.LeaseSigned

  const accepted =
    negStatus === NegotiationStatus.LeaseAccepted ||
    negStatus === NegotiationStatus.LeaseSignInitiated ||
    negStatus === NegotiationStatus.LeaseSigned

  const bothAccepted =
    peerStatus === NegotiationStatus.LeaseAccepted ||
    peerStatus === NegotiationStatus.LeaseSignInitiated ||
    peerStatus === NegotiationStatus.LeaseSigned

  const rent = Number(negotiationTerms.rent) || 0
  const freq = negotiationTerms.frequency || PaymentType.Monthly
  const serviceCharges = Number(negotiationTerms.serviceCharges || 0)
  const freqTotal = rent + serviceCharges
  const monthlyTotal = freq === PaymentType.Monthly ? freqTotal : freqTotal / 3
  const leaseTotal = monthlyTotal * (negotiationTerms.duration || 1)
  const freqText =
    freq === PaymentType.Monthly
      ? t('SUMMARY_MONTHLY_TOTAL')
      : t('SUMMARY_QUARTERLY_TOTAL')

  return (
    <Container>
      {!signing && (
        <>
          <SummaryBlock>
            <Heading>{t('SUMMARY_TITLE')}</Heading>
            <Table>
              <Title>{t('SUMMARY_RENT')}</Title>
              <Value>{formatCurrency(rent, currencyCode)}</Value>
            </Table>
            <Table>
              <Title>{t('SUMMARY_SERVICE_CHARGES')}</Title>
              <Value>{formatCurrency(serviceCharges, currencyCode)}</Value>
            </Table>
            <TableSeparator>
              <SummaryTotal>{freqText}</SummaryTotal>
              <SummaryTotalValue>
                {formatCurrency(freqTotal, currencyCode)}
              </SummaryTotalValue>
            </TableSeparator>
            <Table>
              <SummaryTotalLease>
                {formatMessage(
                  { id: 'SUMMARY_LEASE_TOTAL_MONTHS' },
                  {
                    months: negotiationTerms.duration,
                  },
                )}
              </SummaryTotalLease>
              <SummaryTotalLeaseValue>
                {formatCurrency(leaseTotal, currencyCode)}
              </SummaryTotalLeaseValue>
            </Table>
            {negStatus === NegotiationStatus.TermsAgreed && <CanSignMsg />}
          </SummaryBlock>
          {preview ? (
            <>
              <PreviewMsg />
              <ActionsBlock>
                <PreviewButtons />
              </ActionsBlock>
            </>
          ) : (
            <ActionsBlock>
              {(negStatus === NegotiationStatus.TermsAgreed ||
                negStatus === NegotiationStatus.TermsNotAgreed) && (
                <SummaryButton isMobile={false} />
              )}
            </ActionsBlock>
          )}
        </>
      )}
      {negStatus === NegotiationStatus.SignInfo && (
        <>
          <SummaryBlock>
            <Heading>{t('SUMMARY_SIGNING_TITLE')}</Heading>
          </SummaryBlock>
          <SignStepper userStatus={negStatus} peerStatus={peerStatus} />
          <SignDetailsForm />
          <SignFooter />
        </>
      )}
      {negStatus === NegotiationStatus.AcceptLease && (
        <>
          <SummaryBlock>
            <Heading>{t('SUMMARY_SIGNING_TITLE')}</Heading>
          </SummaryBlock>
          <SignStepper userStatus={negStatus} peerStatus={peerStatus} />
          <SignDetails />
          <SignFooter />
        </>
      )}
      {accepted && (
        <>
          <SummaryBlock>
            <Heading>{t('SUMMARY_SIGNING_TITLE')}</Heading>
          </SummaryBlock>
          <SignStepper userStatus={negStatus} peerStatus={peerStatus} />
          {bothAccepted ? <BothAccepted /> : <LeaseAccepted />}
        </>
      )}
    </Container>
  )
}

export default Summary
