import React from 'react'
import { useIntl } from 'react-intl'
import { formatCurrency } from 'services/global/util'

import styled from 'styled-components'
import { showAvailabilityDate } from 'services/onboarding/utils'
import Data from './Data'

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
`

const SpaceDetail = (props: {
  quantityLabel: string
  quantityValue: string
  availability: Date
  rent: number
  currencyCode: string
}) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  const formatDate = (date: Date) =>
    showAvailabilityDate(date, t('ONBOARDING_AVAILABILITY_NOW'))

  return (
    <InfoContainer>
      <Data label={props.quantityLabel} value={props.quantityValue} />
      <Data
        value={formatDate(props.availability)}
        label={t('YOUR_ENQUIRIES_AVAILABILITY')}
      />
      <Data
        value={formatCurrency(props.rent, props.currencyCode)}
        label={t('YOUR_ENQUIRIES_MONTHLY_PAYMENT')}
      />
    </InfoContainer>
  )
}

export default SpaceDetail
