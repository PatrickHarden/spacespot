import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import history from 'browserhistory'
import { invalidString } from 'services/global/util'
import actions from 'services/onboarding/actions'
import selectors from 'services/onboarding/selectors'
import BuildingDetailsForm, { BuildingFormFields } from './BuildingDetailsForm'
import NextBack from './NextBack'
import AmenityList from './AmenityList'
import Heading3 from 'components/common/Heading3'
import { OnBoardingState } from 'services/onboarding/types'

const SubTitle = styled(Heading3)``

const Section = styled.div`
  margin-bottom: 50px;
`

const SubTitleDesc = styled.div`
  padding: 0 0 20px 0;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  b {
    font-weight: 500;
  }
`

const loadFieldValues = (state?: OnBoardingState) => {
  const fields: BuildingFormFields = {
    location: '',
    address: '',
    city: '',
    postCode: '',
    district: '',
    country: '',
    subdistrict: {
      id: 0,
      name: '',
    },
  }
  if (state) {
    fields.location = state.location
    fields.address = state.address
    fields.city = state.city
    fields.postCode = state.postCode
    fields.latLng = state.latLng
    fields.country = state.country
    fields.district = state.district
    fields.subdistrict = state.subdistrict
  }
  return fields
}

const Bold = (...chunks: any) => <b>{chunks}</b>

const BuildingForm = (props: { isEditing?: boolean }) => {
  const dispatch = useDispatch()
  const state = useSelector(selectors.onboardingState)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { amenities } = state
  const { isEditing } = props
  const [hasTriedNext, setHasTriedNext] = useState(false)

  const initFields = loadFieldValues(state)
  const [fields, setFields] = useState(initFields)

  const valForm = (fields: BuildingFormFields) => {
    const errors: { [key: string]: string } = {}
    if (invalidString(fields.address))
      errors.address = t('ONBOARDING_REQUIRED_FIELD')
    if (invalidString(fields.city)) errors.city = t('ONBOARDING_REQUIRED_FIELD')
    if (invalidString(fields.postCode))
      errors.postCode = t('ONBOARDING_REQUIRED_FIELD')
    if (invalidString(fields.country)) errors.address = t('VAL_INVALID')
    return errors
  }
  const errors = hasTriedNext ? valForm(fields) : {}

  const focusInto = (id: string) => {
    const elm = document.getElementById(id)
    if (elm) elm.focus()
  }

  const submit = () => {
    const errors = valForm(fields)
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      focusInto(keys[0])
      return setHasTriedNext(true)
    }
    // FIXME dispatch unique action
    dispatch(actions.setBuildingData(fields))
    dispatch(actions.setName(fields.address))
    dispatch(actions.setDescription(fields.address))
    dispatch(actions.setLatLng(fields.latLng))
    dispatch(actions.setAddress(fields.address))
    dispatch(actions.setPostCode(fields.postCode))
    dispatch(actions.setCity(fields.city))
    dispatch(actions.setLocation(fields.location))
    if (fields.country) {
      dispatch(actions.setCountry(fields.country))
    }
    if (!isEditing) {
      return dispatch(actions.goToSpace('0'))
    }
    dispatch(actions.updateBuilding())
    history.push(`/onboarding/validating`)
  }

  return (
    <>
      <BuildingDetailsForm
        fields={fields}
        setFields={setFields}
        errors={errors}
      />
      <Section>
        <SubTitle>{t('ONBOARDING_AMENITYLIST_TITLE')}</SubTitle>
        <SubTitleDesc>
          <FormattedMessage
            id="ONBOARDING_AMENITYLIST_INFO"
            values={{
              b: Bold,
            }}
          />
        </SubTitleDesc>
        <AmenityList amenities={amenities} />
      </Section>
      <NextBack
        back={
          isEditing
            ? {
                label: t('ONBOARDING_BACK'),
                onClick: () => history.push(`/dashboard`),
              }
            : undefined
        }
        next={{
          label: isEditing ? t('ONBOARDING_EDIT') : t('ONBOARDING_CONTINUE'),
          onClick: submit,
        }}
      />
    </>
  )
}
export default BuildingForm
