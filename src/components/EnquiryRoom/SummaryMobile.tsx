import React from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import negotiationSelectors from 'services/negotiation/selectors'
import { getRegionCurrencyCode } from 'services/global/region'
import { formatCurrency } from 'services/global/util'
import spaceSelector, { getCountry } from 'services/space/selectors'

import SummaryButton from './SummaryButton'
import { PaymentType } from 'services/negotiation/types'
const Container = styled.div`
  margin: 0px 11px 17px 10px;
  border-top: 1px solid black;
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`
const Table = styled.div`
  width: 33%;
`
const Title = styled.div`
  color: #000000;
  font-size: 14px;
  font-weight: 300;
  line-height: 18px;
`
const ValueLease = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 300;
  line-height: 21px;
`
const ValueMonthly = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  line-height: 21px;
`
const SummaryMobile = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const space = useSelector(spaceSelector.selectedSpace)
  const country = getCountry(space)
  const negotiationTerms = useSelector(negotiationSelectors.getNegotiationTerms)

  const currencyCode = getRegionCurrencyCode(country)
  const rent = Number(negotiationTerms.rent) || 0
  const serviceCharges = Number(negotiationTerms.serviceCharges || 0)
  const freq = negotiationTerms.frequency || PaymentType.Monthly
  const freqTotal = rent + serviceCharges
  const monthlyTotal = freq === PaymentType.Monthly ? freqTotal : freqTotal / 3
  const leaseTotal = monthlyTotal * (negotiationTerms.duration || 1)
  const freqText =
    freq === PaymentType.Monthly
      ? t('SUMMARY_MONTHLY_TOTAL')
      : t('SUMMARY_QUARTERLY_TOTAL')

  return (
    <Container>
      <Table>
        <Title>{freqText}</Title>
        <ValueMonthly>{formatCurrency(freqTotal, currencyCode)}</ValueMonthly>
      </Table>
      <Table>
        <Title>{t('SUMMARY_LEASE_TOTAL')}</Title>
        <ValueLease>{formatCurrency(leaseTotal, currencyCode)}</ValueLease>
      </Table>
      <SummaryButton isMobile={true} />
    </Container>
  )
}

export default SummaryMobile
