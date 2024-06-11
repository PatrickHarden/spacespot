import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Space } from 'services/space/types'
import selectors from 'services/space/selectors'
import moment from 'moment'
import people from 'assets/icons/people.svg'
import calendar from 'assets/icons/calendar.svg'
import { getDesks, getCharges } from 'services/space/helpers'
import { formatPrice } from 'services/global/util'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`
const Align = styled.div`
  display: flex;
  align-items: flex-start;
  img {
    margin-right: 5px;
  }
  span {
    font-size: 16px;
    font-weight: 400;
  }
`

const DetailFixed = (props: { className?: string; space: Space }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { className, space } = props
  const desks = getDesks(space)
  const charges = getCharges(space)
  const contact = t('PRICE_CONTACT_US')
  const rent = formatPrice(charges.rent, charges.currencyCode, contact)
  const availability = selectors.getAvailability(space)
  const availableNow = availability && availability.getTime() < Date.now()
  const date = availableNow
    ? t('PROPCARD_AVAILABLE_NOW')
    : moment(availability).format('MMM')

  return (
    <Container className={className}>
      <Align>
        <span>{rent}</span>
      </Align>
      <Align>
        <img src={people} alt="people" />
        <span>{desks}</span>
      </Align>
      <Align>
        <img src={calendar} alt="calendar" />
        <span>{date}</span>
      </Align>
    </Container>
  )
}

export default DetailFixed
