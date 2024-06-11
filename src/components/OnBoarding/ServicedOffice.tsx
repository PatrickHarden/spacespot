import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import moment from 'moment'
import { AvailabilityFlex } from 'services/onboarding/types'
import { formatCurrency } from 'services/global/util'
import Clear from '@material-ui/icons/Clear'
import Data from './Data'

const Box = styled.div`
  background: white;
  border: 1px solid #dddddd;
  padding: 15px;
  position: relative;
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
`
const People = styled.h3`
  margin: 0;
  color: #010102;
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;
`

const ClearIcon = styled(Clear)`
  display: block;
  font-size: 15px;
  position: absolute;
  color: #ddd;
  top: 5px;
  right: 5px;
  cursor: pointer;
`

const ServicedOffice = (props: {
  office: AvailabilityFlex
  onRemove?: () => void
}) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { office, onRemove } = props

  const from = (availableFrom: Date) =>
    moment(availableFrom).format('DD.MM.YYYY')

  return (
    <Box>
      <ClearIcon onClick={onRemove} />
      <People>
        {office.desks} {t('ONBOARDING_SPACE_SO_PPL')}
      </People>
      <Row>
        <Data
          label={t('ONBOARDING_SPACE_FLEX_PRICE')}
          value={formatCurrency(office.price, office.currencyCode)}
        />
        <Data
          label={t('ONBOARDING_SPACE_SO_FROM')}
          value={from(office.availableFrom)}
        />
        <Data
          label={t('ONBOARDING_SPACE_SO_MIN_TERM')}
          value={office.minLease}
        />
        <Data
          label={t('ONBOARDING_SPACE_SO_FLOOR')}
          value={office.floor || 0}
        />
      </Row>
    </Box>
  )
}

export default ServicedOffice
