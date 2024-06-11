import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import device from 'services/global/device'
import { getCurrencyDesc } from 'services/global/util'
import {
  NegotiationTerms,
  DepositType,
  PaymentType,
} from 'services/negotiation/types'
import { EnquiryType } from 'services/enquiry/types'
import Toggle from 'components/common/Toggle'
import BInput from 'components/common/Input'
import BDatePicker from 'components/common/DatePicker'
import {
  getRegionCurrencyCode,
  getRegionSizeDesc,
} from 'services/global/region'
import spaceSelector, { getCountry } from 'services/space/selectors'
import moment from 'moment'

const Input = styled(BInput)`
  width: 75px;
`

const DatePicker = styled(BDatePicker)`
  max-width: 150px;
`

const ColHeading = styled.h2`
  margin-top: 0;
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
  line-height: 21px;
`

const TermBox = styled.div`
  border: 1px solid #dddddd;
  height: fit-content;
  display: flex;
  flex-direction: row;
  @media ${device.mobile} {
    flex-direction: column;
    height: fit-content;
  }
`

const SizeCol = styled.div`
  flex: 1 1 auto;
  margin: 10px 20px 20px 20px;
  min-width: 85px;
  @media ${device.mobile} {
    margin: 10px;
  }
`

const LengthCol = styled.div`
  flex: 0 1 auto;
  min-width: 150px;
  margin: 10px 20px 20px 0;
  padding-left: 20px;
  height: auto;
  border-left: 1px solid #dddddd;

  @media ${device.mobile} {
    padding-left: 10px;
    margin: 10px 10px 10px 0;
    border: 0;
  }
`

const PaymentCol = styled.div<{ isFlex?: boolean }>`
  flex: 1 1 auto;
  min-width: 150px;
  margin: 10px 20px 20px 0;
  padding-left: 20px;
  border-left: 1px solid #dddddd;
  ${Input} {
    width: 110px;
  }
  @media ${device.mobile} {
    padding-left: 10px;
    margin: 10px 10px 10px 0;
    border: 0;
    ${Input} {
      width: 100%;
    }
  }
`

const DepositCol = styled.div`
  flex: 1 1 auto;
  min-width: 146px;
  width: auto;
  margin: 10px 20px 20px 0px;
  padding-left: 20px;
  border-left: 1px solid #dddddd;
  @media ${device.mobile} {
    padding-left: 10px;
    margin: 10px 10px 10px 0;
    border: 0;
  }
`

const PaymentRow1 = styled.div`
  flex: 1 1 auto;
`
const PaymentRow3 = styled(PaymentRow1)`
  flex: 1 1 auto;
  padding-top: 10px;
`
const PaymentRow2 = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: left;
  width: fit-content;

  @media ${device.mobile} {
    width: 100%;
  }
`

const PaymentItem = styled.div`
  flex: 0 1 auto;
  min-width: 70px;
  margin: 0;

  &:first-child {
    margin-right: 10px;
    width: calc(50% - 10px);
  }

  @media ${device.mobile} {
    width: 50%;
  }
`
const Value = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  margin-top: 15px;
`
const SubValue = styled.div`
  color: #828286;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
`

// store number as string in the form so the input does not invalidate
// the value while typing
const castNum = (val: string): number => (val as unknown) as number

export type FormErrors = { [key: string]: string | undefined }

const LeaseTermForm = (props: {
  terms: NegotiationTerms
  setTerms: (t: NegotiationTerms) => void
  errors: FormErrors
  isFlex?: boolean
  flexType?: EnquiryType
}) => {
  const { terms, setTerms, errors, isFlex, flexType } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  const space = useSelector(spaceSelector.selectedSpace)
  const country = getCountry(space)
  const currencyCode = getRegionCurrencyCode(country)
  const sizeUnits = getRegionSizeDesc(country)

  // const sizeUnits = terms.sizeUnits || 'sq.m.'
  const [lSym, rSym] = getCurrencyDesc(currencyCode || '')
  const currencyDesc = lSym + rSym

  const onChangeTermsDate = (value?: string | null) => {
    if (value) {
      value = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') as string
      setTerms({ ...terms, start: value })
    }
  }

  return (
    <TermBox>
      {isFlex ? (
        <SizeCol>
          <ColHeading>
            {flexType === EnquiryType.HotDesk
              ? t('NEGOTIATE_HOT_DESKS')
              : flexType === EnquiryType.FixedDesk
              ? t('NEGOTIATE_FIXED_DESKS')
              : t('NEGOTIATE_SERVICED_OFFICES')}
          </ColHeading>
          {flexType === EnquiryType.ServicedOffice ? (
            <>
              <Value>{`${terms.noOfDesks} ${t(
                'DETAILS_SERVICED_OFFICES_PEOPLE',
              )}`}</Value>
              <SubValue>{t('DETAILS_MAX_CAPACITY')}</SubValue>
            </>
          ) : (
            <Input
              onChange={e =>
                setTerms({ ...terms, noOfDesks: castNum(e.target.value) })
              }
              id="noOfDesks"
              data-testid="noOfDesks"
              type="number"
              value={terms.noOfDesks}
              min="0"
              error={errors.noOfDesks}
            />
          )}
        </SizeCol>
      ) : (
        <SizeCol>
          <ColHeading>{`${t('NEGOTIATE_AREA')} (${sizeUnits})`}</ColHeading>
          <Input
            onChange={e =>
              setTerms({ ...terms, area: castNum(e.target.value) })
            }
            id="area"
            data-testid="area"
            type="number"
            value={terms.area}
            min="0"
            error={errors.area}
          />
        </SizeCol>
      )}
      <LengthCol>
        <ColHeading>{`${t('NEGOTIATE_LENGTH')} (${t(
          'NEGOTIATE_MONTHS',
        )})`}</ColHeading>
        <Input
          onChange={e =>
            setTerms({ ...terms, duration: castNum(e.target.value) })
          }
          id="duration"
          data-testid="duration"
          type="number"
          value={terms.duration}
          min="0"
          error={errors.duration}
        />
        <DatePicker
          onChange={onChangeTermsDate}
          disablePast
          format="dd.MM.yyyy"
          label={t('NEGOTIATE_START_DATE')}
          id="start"
          value={terms.start ? new Date(terms.start) : new Date()}
          error={errors.start}
        />
      </LengthCol>
      <PaymentCol isFlex={isFlex}>
        <PaymentRow1>
          <ColHeading>{`${t(
            'NEGOTIATE_PAYMENT',
          )} (${currencyDesc})`}</ColHeading>
          <Toggle
            onChange={val => setTerms({ ...terms, frequency: val })}
            displayName1={t('NEGOTIATE_MONTHLY')}
            displayName2={t('NEGOTIATE_QUARTERLY')}
            value1={PaymentType.Monthly}
            value2={PaymentType.Quaterly}
            value={terms.frequency || PaymentType.Monthly}
          />
        </PaymentRow1>
        {isFlex ? (
          <PaymentRow3>
            <Input
              onChange={e =>
                setTerms({ ...terms, rent: castNum(e.target.value) })
              }
              label={t('NEGOTIATE_RENT')}
              id="rent"
              data-testid="rent"
              type="number"
              value={terms.rent}
              min="0"
              error={errors.rent}
            />
          </PaymentRow3>
        ) : (
          <PaymentRow2>
            <PaymentItem>
              <Input
                onChange={e =>
                  setTerms({ ...terms, rent: castNum(e.target.value) })
                }
                label={t('NEGOTIATE_RENT')}
                id="rent"
                data-testid="rent"
                type="number"
                value={terms.rent}
                min="0"
                error={errors.rent}
              />
            </PaymentItem>
            <PaymentItem>
              <Input
                onChange={e =>
                  setTerms({
                    ...terms,
                    serviceCharges: castNum(e.target.value),
                  })
                }
                label={t('NEGOTIATE_SERVICE_CHARGES')}
                id="serviceCharges"
                data-testid="serviceCharges"
                type="number"
                value={terms.serviceCharges}
                min="0"
                error={errors.serviceCharges}
              />
            </PaymentItem>
          </PaymentRow2>
        )}
      </PaymentCol>
      {!isFlex && (
        <DepositCol>
          <ColHeading>{`${t('NEGOTIATE_DEPOSIT')} (${t(
            'NEGOTIATE_MONTHS',
          )})`}</ColHeading>
          <Input
            onChange={e =>
              setTerms({ ...terms, deposit: castNum(e.target.value) })
            }
            id="deposit"
            data-testid="deposit"
            type="number"
            value={terms.deposit}
            min="0"
            error={errors.deposit}
          />
          <Toggle
            onChange={val => setTerms({ ...terms, depositType: val })}
            displayName1={t('NEGOTIATE_DEPOSIT_CASH')}
            displayName2={t('NEGOTIATE_DEPOSIT_GARANTEE')}
            value1={DepositType.Cash}
            value2={DepositType.Guarantee}
            value={terms.depositType || DepositType.Cash}
          />
        </DepositCol>
      )}
    </TermBox>
  )
}

export default LeaseTermForm
