import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import selectors from 'services/onboarding/selectors'
import { invalidString, invalidNumber } from 'services/global/util'
import FilledButton from 'components/common/FilledButton'
import BInput from 'components/common/Input'
import RichTextArea from 'components/common/RichTextArea'
import { getRegionCurrencyDesc } from 'services/global/region'
import { FitoutOptionProps } from 'services/negotiation/types'
import spaceSelector, { getCountry } from 'services/space/selectors'

const Input = styled(BInput)`
  margin-top: 20px;
`

const Container = styled.div`
  border: 1px solid #dddddd;
  border-radius: 2px;
  background-color: #f4f4f4;
  margin-top: 20px;
  padding: 20px;
`
const FitoutFormTitle = styled.div`
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;
`
const ButtonContainer = styled.div`
  text-align: right;
  margin-top: 20px;
`

const ButtonCancel = styled(FilledButton)`
  color: #6cb9d5;
  background-color: #f4f4f4;
`
const ButtonSave = styled(FilledButton)`
  color: #ffffff;
`
const InputHalfWidth = styled(Input)`
  width: 50%;
`
const TextExplanation = styled.div`
  padding-top: 20px;
  color: #000000;
  font-size: 16px;
  font-weight: 400;
`

interface FitoutFormFields {
  name: string
  description: string
  amount: string
}

const FitoutForm = (props: {
  setShow: () => void
  saveFitout: (newFitout: FitoutOptionProps) => void
}) => {
  const { setShow, saveFitout } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const state = useSelector(selectors.onboardingState)
  const space = useSelector(spaceSelector.selectedSpace)
  const country = state.country !== '' ? state.country : getCountry(space)
  const currency = getRegionCurrencyDesc(country)
  const [hasTried, setHasTried] = useState(false)

  const initFields: FitoutFormFields = {
    name: '',
    description: '',
    amount: '',
  }
  const [fields, setFields] = useState(initFields)

  const validate = () => {
    const errors: { [key: string]: string } = {}
    if (invalidString(fields.name)) errors.name = t('VAL_INVALID')
    if (invalidString(fields.description)) errors.description = t('VAL_INVALID')
    if (invalidNumber(fields.amount, 0)) errors.amount = t('VAL_INVALID')
    return errors
  }
  const errors = hasTried ? validate() : {}

  const focusInto = (id: string) => {
    const elm = document.getElementById(id)
    if (elm) elm.focus()
  }

  const submit = () => {
    const errors = validate()
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      focusInto(keys[0])
      setHasTried(true)
      return
    }
    saveFitout({
      name: fields.name,
      description: fields.description,
      amount: Number(fields.amount),
    })
    setFields(initFields)
    setHasTried(false)
  }

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value
    setFields(prev => {
      return { ...prev, [field]: val }
    })
  }

  const handleTAChange = (field: string) => (val: string) => {
    setFields(prev => {
      return { ...prev, [field]: val }
    })
  }

  return (
    <Container>
      <FitoutFormTitle>
        {t('ONBOARDING_FITOUT_OPTIONS_FORM_TITLE')}
      </FitoutFormTitle>
      <Input
        type="text"
        id="name"
        label={t('ONBOARDING_FITOUT_OPTIONS_FORM_NAME')}
        onChange={handleChange('name')}
        placeholder={t('ONBOARDING_PLACEHOLDER_FITOUT_HEADLINE')}
        value={fields.name}
        error={errors.name}
      />
      <RichTextArea
        id="description"
        label={t('ONBOARDING_FITOUT_OPTIONS_FORM_DESCRIPTION')}
        onChange={handleTAChange('description')}
        placeholder={t('ONBOARDING_PLACEHOLDER_FITOUT_DESCRIPTION')}
        rows={2}
        value={fields.description}
        error={errors.description}
      />
      <InputHalfWidth
        type="number"
        id="amount"
        label={`${t('ONBOARDING_FITOUT_OPTIONS_FORM_AMOUNT')} (${currency})`}
        onChange={handleChange('amount')}
        placeholder={t('ONBOARDING_PLACEHOLDER_FITOUT_AMOUNT')}
        value={fields.amount}
        error={errors.amount}
      />
      <TextExplanation>
        {t('ONBOARDING_FITOUT_OPTIONS_EXPLANATION')}
      </TextExplanation>
      <ButtonContainer>
        <ButtonCancel onClick={() => setShow()}>
          {t('ONBOARDING_FITOUT_OPTIONS_FORM_CANCEL')}
        </ButtonCancel>
        <ButtonSave onClick={() => submit()}>
          {t('ONBOARDING_FITOUT_OPTIONS_FORM_SAVE')}
        </ButtonSave>
      </ButtonContainer>
    </Container>
  )
}
export default FitoutForm
