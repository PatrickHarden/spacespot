import React, { useState } from 'react'
import { get } from 'lodash'
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
import { invalidNumber, invalidDate } from 'services/global/util'
import moment from 'moment'

import BasicInput from 'components/common/Input'
import DatePicker from 'components/common/DatePicker'
import FilledButton from 'components/common/FilledButton'
import OutlinedButton from 'components/common/OutlinedButton'
import PlusIcon from 'components/icons/Plus'
import Heading3 from 'components/common/Heading3'
import ServicedOffice from './ServicedOffice'

const Input = styled(BasicInput)`
  label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`
const CInput = styled(Input)`
  width: 178px;
  @media (max-width: 480px) {
    width: 100%;
  }
`

const CancelButton = styled(FilledButton)`
  color: #6cb9d5;
  background-color: #ffffff;
  box-sizing: border-box;
  min-width: 110px;
`

const AddButton = styled(OutlinedButton)`
  background: transparent;
  width: fit-content;
`

const Plus = styled(PlusIcon)`
  margin: 0 5px -1px 0px;
`

const SOContainer = styled.div`
  max-width: 516px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  background-color: #f4f4f4;
  padding: 20px;
  & > div {
    margin-bottom: 20px;
  }
  & > div:last-child {
    margin-bottom: 0px;
  }

  @media (max-width: 767px) {
    padding: 15px;
  }
`

const ContainerInputs = styled.div`
  padding: 10px 15px;
  border: 1px dashed #dddddd;
  background-color: #ffffff;
  flex-grow: 1;
  margin-right: 20px;
  :last-child {
    margin-right: 0;
  }
  max-width: 380px;
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > div {
    margin-right: 20px;
    width: calc(50% - 10px);
  }
  & > div:last-child {
    margin-right: 0;
  }

  @media (max-width: 480px) {
    & > div {
      margin-right: 0;
      width: 100%;
    }
  }
`

const Actions = styled.div`
  button {
    margin-right: 10px;
  }
  button:last-child {
    margin-right: 0;
  }
  margin-top: 20px;
`

const ServicedOffices = (props: { space: SpaceData }) => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const state = useSelector(selectors.onboardingState)
  const country = state ? state.country : ''
  const { space } = props

  const defaultDate = new Date()
  defaultDate.setDate(new Date().getDate() + 1)
  const officeFields: { [key: string]: string } = {
    desks: '',
    minLease: '',
    price: '',
    floor: '',
    availableFrom: defaultDate.toString(),
  }
  const [officeData, setOfficeData] = useState(officeFields)
  const [showErrors, setShowErrors] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const valOffice = () => {
    const errors: { [key: string]: string } = {}
    if (invalidNumber(officeData.desks, 1)) errors.desks = t('VAL_INVALID')
    if (invalidNumber(officeData.minLease, 1))
      errors.minLease = t('VAL_INVALID')
    if (invalidNumber(officeData.price, 0)) errors.price = t('VAL_INVALID')
    if (invalidNumber(officeData.floor)) errors.floor = t('VAL_INVALID')
    if (invalidDate(officeData.availableFrom))
      errors.availableFrom = t('VAL_INVALID')
    return errors
  }
  const officeErrors = showErrors ? valOffice() : {}

  const addOffice = () => {
    const errors = valOffice()
    if (Object.keys(errors).length > 0) {
      setShowErrors(true)
      return
    }
    const office: AvailabilityFlex = {
      desks: Number(officeData.desks),
      minLease: Number(officeData.minLease),
      price: Number(officeData.price),
      floor: Number(officeData.floor),
      availableFrom: new Date(officeData.availableFrom),
      currencyCode: getRegionCurrencyCode(country),
      frequency: AvailabilityFlexPriceInterval.Monthly,
    }
    const newOffices = [...get(space, 'servicedOffices', []), office]
    dispatch(actions.setSpaceServicedOffices(space.id, newOffices))
    setShowForm(false)
    setShowErrors(false)
  }

  const removeOffice = (index: number) => () => {
    const newOffices = [...get(space, 'servicedOffices', [])]
    newOffices.splice(index, 1)
    dispatch(actions.setSpaceServicedOffices(space.id, newOffices))
  }

  const handleSOChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value
    setOfficeData(prev => {
      return { ...prev, [field]: val }
    })
  }

  const onChangeDate = (data: string | number) => {
    if (data) {
      setOfficeData(prev => {
        return { ...prev, availableFrom: data.toString() }
      })
    }
  }

  const offices: Array<AvailabilityFlex> = get(space, 'servicedOffices', [])
  return (
    <>
      <Heading3>{t('ONBOARDING_SPACE_FLEX_SERVICED_OFFICES')}</Heading3>
      <SOContainer>
        {offices.map((office: AvailabilityFlex, index: number) => (
          <ServicedOffice
            key={index}
            office={office}
            onRemove={removeOffice(index)}
          />
        ))}
        {showForm || !offices.length ? (
          <ContainerInputs>
            <CInput
              type="number"
              id="serviced-offices-desks"
              label={t('ONBOARDING_SPACE_SO_PEOPLE')}
              onChange={handleSOChange('desks')}
              value={officeData.desks}
              min={1}
              error={officeErrors.desks}
            />
            <CInput
              type="number"
              id="serviced-offices-floor"
              label={t('ONBOARDING_SPACE_SO_FLOOR')}
              onChange={handleSOChange('floor')}
              value={officeData.floor}
              error={officeErrors.floor}
            />
            <Row>
              <DatePicker
                format="dd.MM.yyyy"
                id="serviced-offices-from"
                label={t('ONBOARDING_SPACE_FLEX_AVAILABILITY')}
                value={new Date(officeData.availableFrom)}
                disablePast={true}
                onChange={e =>
                  onChangeDate(
                    e
                      ? (moment(e, 'DD/MM/YYYY').format('MM/DD/YYYY') as string)
                      : '',
                  )
                }
                error={officeErrors.availableFrom}
              />
              <Input
                id="serviced-offices-min-lease"
                label={t('ONBOARDING_SPACE_FLEX_MINLEASE')}
                value={officeData.minLease}
                onChange={handleSOChange('minLease')}
                type="number"
                min={1}
                error={officeErrors.minLease}
              />
            </Row>
            <CInput
              id="serviced-offices-price"
              label={`${t(
                'ONBOARDING_SPACE_SO_PRICE',
              )} (${getRegionCurrencyDesc(country)})`}
              value={officeData.price}
              onChange={handleSOChange('price')}
              placeholder={t('ONBOARDING_SPACE_SO_PRICE_PLACEHOLDER')}
              type="number"
              min={0}
              error={officeErrors.price}
            />
            <Actions>
              <FilledButton onClick={addOffice}>
                {t('ONBOARDING_SPACE_SO_SAVE')}
              </FilledButton>
              <CancelButton onClick={() => setShowForm(false)}>
                {t('ONBOARDING_SPACE_SO_CANCEL')}
              </CancelButton>
            </Actions>
          </ContainerInputs>
        ) : (
          <AddButton onClick={() => setShowForm(true)}>
            <Plus /> {t('ONBOARDING_SPACE_SO_ADD')}
          </AddButton>
        )}
      </SOContainer>
    </>
  )
}

export default ServicedOffices
