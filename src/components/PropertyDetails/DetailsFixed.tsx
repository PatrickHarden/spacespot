import React, { useState } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import moment from 'moment'

import { Space } from 'services/space/types'
import { getCharges, getDesks, getSize } from 'services/space/helpers'
import selectors, { toSpaceData, getCountry } from 'services/space/selectors'
import { formatCurrency } from 'services/global/util'
import { getRegionSizeDesc } from 'services/global/region'

import people from 'assets/icons/people.svg'
import calendar from 'assets/icons/calendar.svg'
import money from 'assets/icons/money.svg'
import clock from 'assets/icons/clock.svg'
import spaceIcon from 'assets/icons/space.svg'
import EnquiryDialogFixed from './EnquiryDialogFixed'
import ShowPrice from './ShowPrice'
import Bubble from './Bubble'

const People = () => <img src={people} alt="size" />
const Calendar = () => <img src={calendar} alt="calendar" />
const Money = () => <img src={money} alt="payment" />
const Clock = () => <img src={clock} alt="length" />
const SpaceIcon = () => <img src={spaceIcon} alt="length" />

const Container = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
`
const Detail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  img {
    height: 30px;
    margin: 5px auto;
  }
  @media (max-width: 480px) {
    margin: 0 5px;
  }
`
const DetailBlock = styled.div`
  text-align: center;
`

const DetailTitle = styled.h4`
  font-weight: 400;
  font-size: 16px;
  letting-spacing: -0.2px;
  margin: 0;
`
const Now = styled(DetailTitle)`
  color: #f35c2b;
`

const DetailDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #828286;
  word-break: break-all;
  margin: 0;
`

const MoreInfo = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #6cb9d5;
  margin: 0;
  cursor: pointer;
`
const InfoDiv = styled.div`
  min-width: 200px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
`

const InfoCol = styled.div`
  margin-left: 15px;
`

const InfoNotice = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #828286;
  margin: 0;
`

const DetailsFixed = (props: { className?: string; space: Space }) => {
  const [submitOpen, setSubmitOpen] = useState(false)
  const { space } = props
  const [bubbleOpen, setBubbleOpen] = useState(false)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const data = toSpaceData(space)
  const desks = getDesks(space)
  const months = data.months
  const availability = selectors.getAvailability(space)
  const availableNow = availability && availability.getTime() < Date.now()
  const date = moment(availability).format('MMM')
  const charges = getCharges(space)
  const contact = t('PRICE_CONTACT_US')
  const serviceCharges = formatCurrency(
    charges.serviceCharges,
    charges.currencyCode,
  )

  return (
    <Container>
      <Detail>
        <People />
        <DetailBlock>
          <DetailTitle>{desks}</DetailTitle>
          <DetailDesc>{t('DETAILS_MAX_CAPACITY')}</DetailDesc>
        </DetailBlock>
      </Detail>
      <Detail>
        <Money />
        <DetailBlock>
          <DetailTitle>
            <ShowPrice
              value={charges.total}
              currencyCode={charges.currencyCode}
              label={contact}
              setOpenModal={setSubmitOpen}
            />
          </DetailTitle>
          <DetailDesc>{t('DETAILS_MONTHLY_PAYMENT')}</DetailDesc>
          <MoreInfo onClick={() => setBubbleOpen(true)}>
            +{t('DETAILS_INFO')}
          </MoreInfo>
          <Bubble open={bubbleOpen} setOpen={setBubbleOpen}>
            <InfoDiv>
              <InfoCol>
                <DetailDesc>{t('DETAILS_RENT')}</DetailDesc>
                <DetailTitle>
                  <ShowPrice
                    value={charges.rent}
                    currencyCode={charges.currencyCode}
                    label={contact}
                    setOpenModal={setSubmitOpen}
                  />
                </DetailTitle>
              </InfoCol>
              <InfoCol>
                <DetailDesc>{t('DETAILS_SERVICE_CHARGES')}</DetailDesc>
                <DetailTitle>{serviceCharges}</DetailTitle>
              </InfoCol>
            </InfoDiv>
            <InfoNotice>{t('DETAILS_PRICE_NOTICE')}</InfoNotice>
          </Bubble>
        </DetailBlock>
      </Detail>
      <Detail>
        <Clock />
        <DetailBlock>
          <DetailTitle>
            {months} {t('DETAILS_MONTHS')}
          </DetailTitle>
          <DetailDesc>{t('DETAILS_MIN_LEASE_TERM')}</DetailDesc>
        </DetailBlock>
      </Detail>
      <Detail>
        <Calendar />
        <DetailBlock>
          {availableNow ? (
            <Now>{t('PROPCARD_AVAILABLE_NOW')}</Now>
          ) : (
            <DetailTitle>{date}</DetailTitle>
          )}
          <DetailDesc>{t('DETAILS_AVAILABILITY')}</DetailDesc>
        </DetailBlock>
      </Detail>
      <Detail>
        <SpaceIcon />
        <DetailBlock>
          <DetailTitle>{getSize(space)}</DetailTitle>
          <DetailDesc>{getRegionSizeDesc(getCountry(space))}</DetailDesc>
        </DetailBlock>
      </Detail>
      <EnquiryDialogFixed open={submitOpen} setOpen={setSubmitOpen} />
    </Container>
  )
}

export default DetailsFixed
