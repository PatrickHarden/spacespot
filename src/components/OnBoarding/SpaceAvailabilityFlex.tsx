import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import actions from 'services/onboarding/actions'
import selectors from 'services/onboarding/selectors'
import {
  SpaceData,
  AvailabilityFlex,
  AvailabilityFlexPriceInterval,
} from 'services/onboarding/types'
import {
  getRegionCurrencyDesc,
  getRegionCurrencyCode,
} from 'services/global/region'
import { invalidDate, invalidNumber } from 'services/global/util'

import Input from 'components/common/Input'
import DatePicker from 'components/common/DatePicker'
import Heading3 from 'components/common/Heading3'
import Heading4 from 'components/common/Heading4'
import ServicedOffices from './ServicedOffices'
import moment from 'moment'

const Header4 = styled(Heading4)`
  margin-top: 0;
`
const Container = styled.div`
  max-width: 516px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  border-radius: 2px;
  background-color: #f4f4f4;
  padding: 20px;
  margin-bottom: 50px;

  @media (max-width: 767px) {
    padding: 15px;
  }
`

const ContainerInputs = styled.div`
  padding: 10px 15px;
  border: 1px dashed #dddddd;
  background-color: #ffffff;
  flex-grow: 1;
  margin-right: 10px;
  :last-child {
    margin-right: 0;
    margin-left: 10px;
  }
  width: calc(50% - 42px);
  max-width: 330px;

  @media (max-width: 480px) {
    width: 100%;
    margin: 0 0 20px;
    :last-child {
      margin: 0;
    }
  }
`

const getDefaultFields = (value?: AvailabilityFlex) => {
  const fields: { [key: string]: string } = {}
  if (value) {
    fields.desks = value.desks ? value.desks.toString() : ''
    fields.minLease = value.minLease ? value.minLease.toString() : ''
    fields.price = value.price ? value.price.toString() : ''
    fields.availableFrom = value.availableFrom.toString()
  } else {
    const defaultDate = new Date()
    defaultDate.setDate(new Date().getDate() + 1)
    fields.desks = ''
    fields.minLease = ''
    fields.price = ''
    fields.availableFrom = defaultDate.toString()
  }
  return fields
}

const SpaceAvailabilityFlex = (props: {
  space: SpaceData
  setError: (id: string | null) => void
}) => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const state = useSelector(selectors.onboardingState)
  const country = state ? state.country : ''

  const { space, setError } = props

  const hotFields = getDefaultFields(space.hotDesks)
  const [hotData, setHotData] = useState(hotFields)
  const [showHotErrors, setShowHotErrors] = useState(false)
  const fixedFields = getDefaultFields(space.fixedDesks)
  const [fixedData, setFixedData] = useState(fixedFields)
  const [showFixedErrors, setShowFixedErrors] = useState(false)

  const valForm = (fields: { [key: string]: string }) => {
    const errors: { [key: string]: string } = {}
    if (!fields.desks) fields.desks = '0'
    if (invalidNumber(fields.desks, 0)) errors.desks = t('VAL_INVALID')
    if (Number(fields.desks) > 0) {
      if (invalidNumber(fields.minLease, 1)) errors.minLease = t('VAL_INVALID')
      if (invalidNumber(fields.price, 0)) errors.price = t('VAL_INVALID')
      if (invalidDate(fields.availableFrom))
        errors.availableFrom = t('VAL_INVALID')
    }
    return errors
  }
  const fixedErrors = showFixedErrors ? valForm(fixedData) : {}
  const hotErrors = showHotErrors ? valForm(hotData) : {}

  const mapToAvailability = (data: {
    [key: string]: string
  }): AvailabilityFlex => {
    const desks = Number(data.desks)
    return {
      desks,
      minLease: desks > 0 ? Number(data.minLease) : 0,
      price: desks > 0 ? Number(data.price) : 0,
      availableFrom: new Date(data.availableFrom),
      currencyCode: getRegionCurrencyCode(country),
      frequency: AvailabilityFlexPriceInterval.Monthly,
    }
  }

  const hotVal = (newData: { [key: string]: string }) => {
    const errors = valForm(newData)
    if (Object.keys(errors).length > 0) {
      setShowHotErrors(true)
      setError('hot-desks-' + Object.keys(errors)[0])
      return
    }
    setError(null)
    const hotDesks = mapToAvailability(newData)
    dispatch(actions.setSpaceHotDesks(space.id, hotDesks))
  }

  const hotChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value
    const newData = { ...hotData, [field]: val }
    setHotData(newData)
    hotVal(newData)
  }
  const hotChangeDate = (field: string) => (d?: string | null) => {
    if (d) {
      d = moment(d, 'DD/MM/YYYY').format('MM/DD/YYYY') as string
      const newData = { ...hotData, [field]: d }
      setHotData(newData)
      hotVal(newData)
    }
  }

  const fixedVal = (newData: { [key: string]: string }) => {
    const errors = valForm(newData)
    if (Object.keys(errors).length > 0) {
      setShowFixedErrors(true)
      setError('fixed-desks-' + Object.keys(errors)[0])
      return
    }
    setError(null)
    const fixedDesks = mapToAvailability(newData)
    dispatch(actions.setSpaceFixedDesks(space.id, fixedDesks))
  }

  const fixedChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value
    const newData = { ...fixedData, [field]: val }
    setFixedData(newData)
    fixedVal(newData)
  }
  const fixedChangeDate = (field: string) => (d?: string | null) => {
    if (d) {
      d = moment(d, 'DD/MM/YYYY').format('MM/DD/YYYY') as string
      const newData = { ...fixedData, [field]: d }
      setFixedData(newData)
      fixedVal(newData)
    }
  }

  const zeroToEmpty = (val: string) => {
    return val === '0' ? '' : val
  }

  return (
    <>
      <Heading3>{t('ONBOARDING_SPACE_AVAILABILITY_FLEX_TITLE')}</Heading3>
      <Container>
        <ContainerInputs>
          <Header4>{t('ONBOARDING_SPACE_FLEX_HOT_DESKS')}</Header4>
          <Input
            id="hot-desks-desks"
            data-testid="hot-desks-desks"
            type="number"
            label={t('ONBOARDING_SPACE_FLEX_DESKS')}
            onChange={hotChange('desks')}
            value={zeroToEmpty(hotData.desks)}
            error={hotErrors.desks}
          />
          <DatePicker
            format="dd.MM.yyyy"
            id="hot-desks-availableFrom"
            data-testid="hot-desks-from"
            label={t('ONBOARDING_SPACE_FLEX_AVAILABILITY')}
            value={new Date(hotData.availableFrom)}
            onChange={hotChangeDate('availableFrom')}
            disablePast={true}
            error={hotErrors.availableFrom}
          />
          <Input
            id="hot-desks-minLease"
            data-testid="hot-desks-min-lease"
            type="number"
            label={t('ONBOARDING_SPACE_FLEX_MINLEASE')}
            onChange={hotChange('minLease')}
            value={hotData.minLease}
            error={hotErrors.minLease}
          />
          <Input
            id="hot-desks-price"
            data-testid="hot-desks-price"
            type="number"
            label={`${t(
              'ONBOARDING_SPACE_FLEX_PRICE',
            )} (${getRegionCurrencyDesc(country)})`}
            onChange={hotChange('price')}
            placeholder={t('ONBOARDING_PLACEHOLDER_FLEX_PRICE')}
            value={hotData.price}
            error={hotErrors.price}
          />
        </ContainerInputs>
        <ContainerInputs>
          <Header4>{t('ONBOARDING_SPACE_FLEX_FIXED_DESKS')}</Header4>
          <Input
            id="fixed-desks-desks"
            data-testid="fixed-desks-desks"
            type="number"
            label={t('ONBOARDING_SPACE_FLEX_DESKS')}
            onChange={fixedChange('desks')}
            value={zeroToEmpty(fixedData.desks)}
            error={fixedErrors.desks}
          />
          <DatePicker
            format="dd.MM.yyyy"
            id="fixed-desks-availableFrom"
            data-testid="fixed-desks-from"
            label={t('ONBOARDING_SPACE_FLEX_AVAILABILITY')}
            value={new Date(fixedData.availableFrom)}
            onChange={fixedChangeDate('availableFrom')}
            disablePast={true}
            error={fixedErrors.availableFrom}
          />
          <Input
            id="fixed-desks-minLease"
            data-testid="fixed-desks-min-lease"
            type="number"
            label={t('ONBOARDING_SPACE_FLEX_MINLEASE')}
            onChange={fixedChange('minLease')}
            value={fixedData.minLease}
            error={fixedErrors.minLease}
          />
          <Input
            id="fixed-desks-price"
            data-testid="fixed-desks-price"
            type="number"
            label={`${t(
              'ONBOARDING_SPACE_FLEX_PRICE',
            )} (${getRegionCurrencyDesc(country)})`}
            onChange={fixedChange('price')}
            placeholder={t('ONBOARDING_PLACEHOLDER_FLEX_PRICE')}
            value={fixedData.price}
            error={fixedErrors.price}
          />
        </ContainerInputs>
      </Container>
      <ServicedOffices space={space} />
    </>
  )
}
export default SpaceAvailabilityFlex
