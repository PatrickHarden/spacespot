import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import Input from 'components/common/Input'
import Heading2 from 'components/common/Heading2'
import Heading4 from 'components/common/Heading4'
import FilledButton from 'components/common/FilledButton'
import OutlinedButton from 'components/common/OutlinedButton'

import actions from 'services/negotiation/actions'
import { NegotiationStatus } from 'services/negotiation/types'
import { invalidString, invalidEmail } from 'services/global/util'
import { useSignerInfo } from 'services/negotiation/hooks'

const SignButtons = styled(
  (props: { className?: string; onNext: () => void; onBack: () => void }) => {
    const { className, onNext, onBack } = props
    const { formatMessage } = useIntl()
    const t = (s: string) => formatMessage({ id: s })
    return (
      <div className={className}>
        <FilledButton onClick={onNext}>
          {t('SUMMARY_CTA_CONTINUE')}
        </FilledButton>
        <OutlinedButton onClick={onBack}>
          {t('SUMMARY_CTA_CANCEL')}
        </OutlinedButton>
      </div>
    )
  },
)`
  display: flex;
  margin-top: 20px;
  border-top: 1px solid #dddddd;
  flex-direction: column;
  align-items: center;
  padding: 1em 0px;
  ${FilledButton} {
    width: 100%;
    background: #404042;
    margin-bottom: 5px;
  }
  ${OutlinedButton} {
    width: 100%;
    border: none;
    color: #404042;
    text-transform: none;
  }
`

const Subtitle = styled(Heading4)`
  margin-top: 20px;
  margin-bottom: 0;
`

const Desc = styled.p`
  margin: 0;
  color: #6d6c6c;
`

const FormBlock = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
`

const Row = styled.div`
  margin-right: -10px;
  display: flex;
  & > div {
    margin-right: 10px;
  }
  margin-bottom: 30px;
`

const SignDetailsForm = styled((props: { className?: string }) => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { className } = props
  const signerInfo = useSignerInfo()
  const details0 = {
    name: '',
    emailId: '',
    companyNumber: '',
    companyName: '',
  }
  const [details, setDetails] = useState(details0)
  useEffect(() => {
    if (signerInfo) {
      setDetails(signerInfo)
    }
  }, [signerInfo, setDetails])

  const onChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDetails({ ...details, [name]: e.target.value })
  }

  const [touched, setTouched] = useState(false)
  const validate = () => {
    const errors: { [key: string]: string } = {}
    if (invalidString(details.name))
      errors.name = t('SUMMARY_SIGNING_FORM_INVALID')
    if (invalidEmail(details.emailId))
      errors.emailId = t('SUMMARY_SIGNING_FORM_INVALID')
    if (invalidString(details.companyNumber))
      errors.companyNumber = t('SUMMARY_SIGNING_FORM_INVALID')
    if (invalidString(details.companyName))
      errors.companyName = t('SUMMARY_SIGNING_FORM_INVALID')
    return errors
  }

  const next = () => {
    setTouched(true)
    const errors = validate()
    const n = Object.keys(errors).length
    if (n === 0) {
      if (signerInfo) {
        dispatch(actions.putSignerInfo(details))
      } else {
        dispatch(actions.postSignerInfo(details))
      }
    }
  }

  const back = () => {
    dispatch(actions.putNegotiationStatus(NegotiationStatus.PreviewStart))
  }

  const errors: { [key: string]: string } = touched ? validate() : {}
  return (
    <div className={className}>
      <Heading2>{t('SUMMARY_SIGNING_FORM_TITLE')}</Heading2>
      <FormBlock>
        <Subtitle>{t('SUMMARY_SIGNING_FORM_PERSON')}</Subtitle>
        <Desc>{t('SUMMARY_SIGNING_FORM_PERSON_DSC')}</Desc>
        <Input
          id="name"
          onChange={onChange('name')}
          data-testid="name"
          type="text"
          label={t('SUMMARY_SIGNING_FORM_NAME')}
          value={details.name}
          min="0"
          error={errors.name}
        />
        <Input
          id="emailId"
          onChange={onChange('emailId')}
          data-testid="emailId"
          type="text"
          label={t('SUMMARY_SIGNING_FORM_EMAIL')}
          value={details.emailId}
          min="0"
          error={errors.emailId}
        />
      </FormBlock>
      <FormBlock>
        <Subtitle>{t('SUMMARY_SIGNING_FORM_LEGAL')}</Subtitle>
        <Desc>{t('SUMMARY_SIGNING_FORM_LEGAL_DSC')}</Desc>
        <Row>
          <Input
            id="companyName"
            onChange={onChange('companyName')}
            data-testid="companyName"
            type="text"
            label={t('SUMMARY_SIGNING_FORM_LEGAL_NAME')}
            value={details.companyName}
            min="0"
            error={errors.companyName}
          />
          <Input
            id="companyNumber"
            onChange={onChange('companyNumber')}
            data-testid="companyNumber"
            type="text"
            label={t('SUMMARY_SIGNING_FORM_LEGAL_NUMBER')}
            value={details.companyNumber}
            min="0"
            error={errors.companyNumber}
          />
        </Row>
      </FormBlock>
      <SignButtons onNext={next} onBack={back} />
    </div>
  )
})`
  margin: 0 20px;
`

export default SignDetailsForm
