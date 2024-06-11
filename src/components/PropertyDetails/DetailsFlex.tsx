import React, { useState } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import moment from 'moment'

import { Space } from 'services/space/types'
import { AvailabilityFlex } from 'services/onboarding/types'
import selectors from 'services/space/selectors'
import { isArray } from 'util'
import { Heading2 } from 'components/common/Heading2'
import device from 'services/global/device'
import EnquiryDialogFlex from './EnquiryDialogFlex'
import ShowPrice from './ShowPrice'

const Container = styled.div`
  margin: 10px 0 10px 0;
  justify-content: space-around;
  align-items: flex-start;
`

const InfoCol = styled.div`
  margin-top: 10px;
  padding: 10px;
  width: 66%;
  display: flex;
  border: 1px solid #dddddd;
  background-color: #ffffff;
  @media ${device.lessThanTablet} {
    width: 100%;
    box-sizing: border-box;
    flex-wrap: wrap;
  }
`
const DesksTitle = styled.div`
  width: 30%;
  color: #010102;
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;

  @media ${device.lessThanIPad} {
    width: 100%;
  }
`
const Price = styled.div`
  width: 25%;

  @media ${device.lessThanIPad} {
    width: 50%;
    margin-top: 15px;
  }
`
const LeaseTerms = styled.div`
  width: 20%;

  @media ${device.lessThanIPad} {
    width: 50%;
    margin-top: 15px;
  }
`
const Available = styled.div`
  width: 25%;

  @media ${device.lessThanIPad} {
    width: 100%;
    margin-top: 15px;
  }
`
const InfoValue = styled.div`
  color: #010102;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
`
const InfoUnits = styled.div`
  color: #828286;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
`
const Title = styled(Heading2)`
  border-bottom: 1px solid #ddd;
  margin: 40px 0 0 0;
  text-align: left;
  width: 100%;
  ::before {
    // Fix anchor offset with fixed nav
    content: ' ';
    display: block;
    margin-top: -50px;
    height: 50px;
    visibility: hidden;
  }
`
const ShowNow = styled.div`
  color: #010102;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  text-transform: uppercase;
`
const ShowAvailableFormDetail = styled.div`
  color: #828286;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
`
const ShowAvailableFormValue = styled.div`
  color: #010102;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
`

const DetailsFlex = (props: { className?: string; space: Space }) => {
  const [submitOpen, setSubmitOpen] = useState(false)
  const { space } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const hotDesks = selectors.getFlexAvailability(space, 'HotDesk')
  const fixedDesks = selectors.getFlexAvailability(space, 'FixedDesk')
  const servicedOffices = selectors.getFlexAvailability(space, 'ServicedOffice')
  const contact = t('PRICE_CONTACT_US')

  const showAvailableFrom = (availableFrom: Date) =>
    availableFrom && availableFrom.getTime() < Date.now() ? (
      <ShowNow>{t('DETAILS_AVAILABLE_NOW')}</ShowNow>
    ) : (
      <>
        <ShowAvailableFormValue>
          {moment(availableFrom).format('DD.MM.YYYY')}
        </ShowAvailableFormValue>
        <ShowAvailableFormDetail>
          {t('DETAILS_AVAILABLE_FROM')}
        </ShowAvailableFormDetail>
      </>
    )
  return (
    <Container>
      <Title id="details">{t('DETAILS_DESKS')}</Title>
      {hotDesks && !isArray(hotDesks) ? (
        <InfoCol>
          <DesksTitle>
            {hotDesks.desks} {t('DETAILS_HOT_DESKS')}
          </DesksTitle>
          <Price>
            <InfoValue>
              <ShowPrice
                value={hotDesks.price}
                currencyCode={hotDesks.currencyCode}
                label={contact}
                setOpenModal={setSubmitOpen}
              />
            </InfoValue>
            <InfoUnits>{t('DETAILS_DESK_MONTH')}</InfoUnits>
          </Price>
          <LeaseTerms>
            <InfoValue>
              {hotDesks.minLease} {t('DETAILS_MONTH_MINIFIED')}
            </InfoValue>
            <InfoUnits>{t('DETAILS_MIN_TERM')}</InfoUnits>
          </LeaseTerms>
          <Available>
            <InfoValue>{showAvailableFrom(hotDesks.availableFrom)}</InfoValue>
          </Available>
        </InfoCol>
      ) : null}
      {fixedDesks && !isArray(fixedDesks) ? (
        <InfoCol>
          <DesksTitle>
            {fixedDesks.desks} {t('DETAILS_FIXED_DESKS')}
          </DesksTitle>
          <Price>
            <InfoValue>
              <ShowPrice
                value={fixedDesks.price}
                currencyCode={fixedDesks.currencyCode}
                label={contact}
                setOpenModal={setSubmitOpen}
              />
            </InfoValue>
            <InfoUnits>{t('DETAILS_DESK_MONTH')}</InfoUnits>
          </Price>
          <LeaseTerms>
            <InfoValue>
              {fixedDesks.minLease} {t('DETAILS_MONTH_MINIFIED')}
            </InfoValue>
            <InfoUnits>{t('DETAILS_MIN_TERM')}</InfoUnits>
          </LeaseTerms>
          <Available>
            <InfoValue>{showAvailableFrom(fixedDesks.availableFrom)}</InfoValue>
          </Available>
        </InfoCol>
      ) : null}
      <Title id="servicedOffices">{t('DETAILS_SERVICED_OFFICES')}</Title>
      {servicedOffices && isArray(servicedOffices)
        ? servicedOffices
          .sort((a, b) => a.desks - b.desks)
          .map((office: AvailabilityFlex, index: number) => (
            <InfoCol key={index}>
              <DesksTitle>
                {office.desks} {t('DETAILS_SERVICED_OFFICES_PEOPLE')}
                <InfoUnits>{t('DETAILS_MAX_CAPACITY')}</InfoUnits>
              </DesksTitle>
              <Price>
                <InfoValue>
                  <ShowPrice
                    value={office.price}
                    currencyCode={office.currencyCode}
                    label={contact}
                    setOpenModal={setSubmitOpen}
                  />
                </InfoValue>
                <InfoUnits>{t('DETAILS_SERVICED_OFFICES_DESK')}</InfoUnits>
              </Price>
              <LeaseTerms>
                <InfoValue>
                  {office.minLease} {t('DETAILS_MONTH_MINIFIED')}
                </InfoValue>
                <InfoUnits>{t('DETAILS_MIN_TERM')}</InfoUnits>
              </LeaseTerms>
              <Available>
                <InfoValue>
                  {showAvailableFrom(office.availableFrom)}
                </InfoValue>
              </Available>
            </InfoCol>
          ))
        : null}
      <EnquiryDialogFlex open={submitOpen} setOpen={setSubmitOpen} />
    </Container>
  )
}

export default DetailsFlex
