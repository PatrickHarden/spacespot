import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import device from 'services/global/device'
import { formatCurrency } from 'services/global/util'
import { showAvailabilityDate } from 'services/onboarding/utils'
import {
  NegotiationTerms,
  PaymentType,
  DepositType,
  TermStatus,
} from 'services/negotiation/types'
import { EnquiryType } from 'services/enquiry/types'
import Avatar from 'components/Avatar/Avatar'
import CheckCircle from './CheckCircle'
import { getLeaseStatusColor } from './LeaseTerms'
import { useSelector } from 'react-redux'
import spaceSelector, { getCountry } from 'services/space/selectors'
import {
  getRegionCurrencyDesc,
  getRegionSizeDesc,
} from 'services/global/region'

const ColHeading = styled.h2`
  margin-top: 0;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  text-transform: capitalize;
`

const SubHeading = styled.div`
  margin-top: -3px;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #828286;
  line-height: 18px;
`

const Value = styled.div`
  margin-top: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
`

const TermBox = styled.div<{ status: TermStatus; disabled?: boolean }>`
  border: ${props => (props.status === TermStatus.Accepted ? 2 : 1)}px solid
    ${props => getLeaseStatusColor(props.status)};
  position: relative;
  height: auto;
  display: flex;
  flex-direction: row;
  @media ${device.mobile} {
    flex-direction: column;
    height: fit-content;
  }
`

const SizeCol = styled.div`
  flex: 1 0 40px;
  margin: 10px 10px 10px 10px;
`

const LengthCol = styled.div`
  min-width: 90px;
  flex: 1 0 auto;
  height: auto;
  margin: 10px 10px 10px 10px;
  padding-left: 10px;
  border-left: 1px solid #dddddd;
  @media ${device.mobile} {
    padding-left: 0;
    border-left: none;
  }
`
const PaymentCol = styled.div`
  flex: 1 1 auto;
  min-width: 170px;
  height: auto;
  margin: 10px 10px 10px 0;
  padding-left: 10px;
  border-left: 1px solid #dddddd;
`

const DepositCol = styled.div`
  flex: 1 1 auto;
  min-width: 80px;
  margin: 10px 10px 10px 0;
  padding-left: 10px;
  border-left: 1px solid #dddddd;
`

const PaymentTab = styled.div`
  display: flex;
  justify-content: left;
  div:last-child {
    margin-right: 0;
  }
`
const PaymentItem = styled.div`
  flex: 0 1 auto;
  margin-right: 20px;
`

const LeaseAvatar = styled(Avatar)`
  flex: 0 0 auto;
  margin: 15px 10px;
  height: 40px;
  width: 40px;
  display: none;
  @media ${device.desktop} {
    display: inherit;
  }
`

const ToBeConfirmed = styled.div`
  padding-top: 22px;
`

const LeaseTermView = (props: {
  terms: NegotiationTerms
  status: TermStatus
  userId: string
  isFlex?: boolean
  flexType?: EnquiryType
  disabled?: boolean
}) => {
  const { terms, isFlex, flexType, status, userId, disabled } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const space = useSelector(spaceSelector.selectedSpace)
  const country = getCountry(space)
  const currencyCode = getRegionCurrencyDesc(country)
  const sizeUnits = getRegionSizeDesc(country)

  return (
    <TermBox status={status} disabled={disabled}>
      {!disabled && status === TermStatus.Accepted ? (
        <CheckCircle fontSize="default" htmlColor="#6CB9D5" />
      ) : null}
      <LeaseAvatar userId={userId} isLandlord={true} />
      {isFlex ? (
        <SizeCol>
          <ColHeading>
            {flexType === EnquiryType.HotDesk
              ? t('NEGOTIATE_HOT_DESKS')
              : flexType === EnquiryType.FixedDesk
              ? t('NEGOTIATE_FIXED_DESKS')
              : t('NEGOTIATE_SERVICED_OFFICES')}
          </ColHeading>
          <Value>
            {`${terms.noOfDesks} `}
            {flexType === EnquiryType.ServicedOffice
              ? t('DETAILS_SERVICED_OFFICES_PEOPLE')
              : null}
          </Value>
        </SizeCol>
      ) : (
        <SizeCol>
          <ColHeading>{t('NEGOTIATE_AREA')}</ColHeading>
          <Value>{`${terms.area}${sizeUnits}`}</Value>
        </SizeCol>
      )}
      <LengthCol>
        <ColHeading>{t('NEGOTIATE_LENGTH')}</ColHeading>
        <Value>
          {`${terms.duration} ${t('NEGOTIATE_MONTHS')} `}
          {`${t('NEGOTIATE_FROM')} ${showAvailabilityDate(
            terms.start ? new Date(terms.start) : new Date(),
            t('ONBOARDING_AVAILABILITY_NOW'),
          )}`}
        </Value>
      </LengthCol>
      <PaymentCol>
        <ColHeading>{`${
          terms.frequency === PaymentType.Quaterly
            ? t('NEGOTIATE_QUARTERLY')
            : t('NEGOTIATE_MONTHLY')
        } ${t('NEGOTIATE_PAYMENT')}`}</ColHeading>
        <PaymentTab>
          <PaymentItem>
            <Value>{formatCurrency(terms.rent || 0, currencyCode)}</Value>
            <SubHeading>{t('NEGOTIATE_RENT')}</SubHeading>
          </PaymentItem>
          {!isFlex && terms.serviceCharges ? (
            <PaymentItem>
              <Value>
                {formatCurrency(terms.serviceCharges, currencyCode)}
              </Value>
              <SubHeading>{t('NEGOTIATE_SERVICE_CHARGES')}</SubHeading>
            </PaymentItem>
          ) : null}
        </PaymentTab>
      </PaymentCol>
      {!isFlex && (
        <>
          {terms.deposit ? (
            <DepositCol>
              <ColHeading>{t('NEGOTIATE_DEPOSIT')}</ColHeading>
              <Value>{`${terms.deposit} ${t('NEGOTIATE_DEPOSIT_IN')} ${
                terms.depositType === DepositType.Cash
                  ? t('NEGOTIATE_DEPOSIT_CASH')
                  : t('NEGOTIATE_DEPOSIT_GARANTEE')
              }`}</Value>
            </DepositCol>
          ) : (
            <DepositCol>
              <ToBeConfirmed>{t('NEGOTIATE_DEPOSIT_TBC')}</ToBeConfirmed>
            </DepositCol>
          )}
        </>
      )}
    </TermBox>
  )
}

export default LeaseTermView
