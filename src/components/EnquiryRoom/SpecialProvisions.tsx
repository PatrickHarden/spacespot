import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { get } from 'lodash'

import userSelectors from 'services/user/selectors'
import enquirySelectors from 'services/enquiry/selectors'
import actions from 'services/negotiation/actions'
import selectors from 'services/negotiation/selectors'
import { TermStatus, SpecialProvisionStatus } from 'services/negotiation/types'

import OutlinedButton from 'components/common/OutlinedButton'
import FilledButton from 'components/common/FilledButton'
import Plus from 'components/icons/Plus'
import RichTextArea from 'components/common/RichTextArea'

import Clear from '@material-ui/icons/Clear'
import { SvgIconProps } from '@material-ui/core'
import CheckCircle from './CheckCircle'

import LeaseTemplate from './LeaseTemplate'
import HTMLContent from 'components/common/HTMLContent'

const AddButton = styled(OutlinedButton)`
  box-sizing: border-box;
  min-width: 110px;
  svg {
    margin: 0px 5px -2px 0px;
  }
`
const CancelButton = styled(FilledButton)`
  background: transparent;
  color: #6cb9d5;
`
const SaveButton = styled(FilledButton)`
  margin-left: 10px;
`

const DeclineButton = styled(OutlinedButton)`
  color: #6cb9d5;
  background-color: #ffffff;
  box-sizing: border-box;
  min-width: 110px;
  margin-right: 20px;
`

const AcceptButton = styled(FilledButton)`
  color: white;
  background-color: #6cb9d5;
  box-sizing: border-box;
  min-width: 110px;
`

const ChangeButton = styled.button`
  padding-top: 0;
  color: #6d6c6c;
  border: none;
  outline: none;
  background: white;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Container = styled.div`
  margin-bottom: 40px;
  width: calc(100% - 15px);
  h3 {
    color: #000000;
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  }
  li {
    color: #828286;
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  }
`

const Form = styled.div`
  border: 1px solid #dddddd;
  border-radius: 2px;
  background-color: #f4f4f4;
  margin-top: 20px;
  padding: 20px;
  h3 {
    margin-top: 0.5em;
    color: #000000;
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
  }
`

const getStatusColor = (status?: SpecialProvisionStatus) =>
  status
    ? get(
        {
          [SpecialProvisionStatus.Declined]: '#DB4437',
          [SpecialProvisionStatus.Proposed]: '#EBBF59',
          [SpecialProvisionStatus.Created]: '#EBBF59',
          [SpecialProvisionStatus.Accepted]: '#6CB9D5',
        },
        status,
        '#CECECE',
      )
    : '#CECECE'

const Box = styled.div<{ status?: SpecialProvisionStatus }>`
  border: ${props =>
      props.status === SpecialProvisionStatus.Accepted ? 2 : 1}px
    solid ${props => getStatusColor(props.status)};
  padding: 10px;
  position: relative;
  margin-bottom: 10px;
`

const CloseIcon = styled(
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars,  no-unused-vars */
  ({ isVisible, ...rest }: SvgIconProps & { isVisible: boolean }) => (
    <Clear {...rest} />
  ),
)`
  display: ${props => (props.isVisible ? 'block' : 'none')};
  font-size: 15px;
  position: absolute;
  color: #ddd;
  top: 5px;
  right: 5px;
  cursor: pointer;
`

const RejectedBox = styled.div`
  padding: 5px;
  position: relative;
  margin-bottom: 15px;
  border: 1px solid #ebbf59;
  background-color: rgba(235, 191, 89, 0.3);
  font-weight: 500;
`

const Info = (props: { t: (key: string) => string; isLandlord: boolean }) => {
  const t = props.t
  return props.isLandlord ? (
    <>
      <h3>{t('SPECIAL_PROV_HEADING')}</h3>
      <ul>
        <li>{t('SPECIAL_PROV_INDEX')}</li>
        <li>{t('SPECIAL_PROV_DOCS_NEW')}</li>
      </ul>
    </>
  ) : null
}
const TextAccepting = styled.div`
  color: #6d6c6c;
  font-size: 14px;
  font-weight: 400;
  text-align: right;
  float: right;
  padding-top: 10px;
  width: 270px;
`
const StatusText = styled.span<{ status?: SpecialProvisionStatus }>`
  color: ${props => getStatusColor(props.status)};
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  text-align: right;
`

const statusMessage = (status?: SpecialProvisionStatus) => {
  switch (status) {
    case SpecialProvisionStatus.Created:
      return 'SPECIAL_PROV_STATUS_CREATED'
    case SpecialProvisionStatus.Accepted:
      return 'SPECIAL_PROV_STATUS_ACCEPTED'
    case SpecialProvisionStatus.Declined:
      return 'SPECIAL_PROV_STATUS_REJECTED'
    default:
      return 'SPECIAL_PROV_STATUS_CREATED'
  }
}

const LandlordActions = styled(
  (props: {
    className?: string
    t: (key: string) => string
    hasValue: boolean
    status?: SpecialProvisionStatus
    onClickModify: () => void
    onClickAdd: () => void
  }) => {
    const { t, className, hasValue, status, onClickModify, onClickAdd } = props
    return (
      <div className={className}>
        {hasValue ? (
          <>
            <AddButton onClick={onClickModify}>
              {t('SPECIAL_PROV_MODIFY')}
            </AddButton>
            <StatusText status={status}>
              {hasValue && t(statusMessage(status))}
            </StatusText>
          </>
        ) : (
          <AddButton onClick={onClickAdd}>
            <Plus size="1.1em" />
            {t('SPECIAL_PROV_ADD')}
          </AddButton>
        )}
      </div>
    )
  },
)`
  display: flex;
  justify-content: space-between;
`

const TenantActions = styled(
  (props: {
    className?: string
    t: (key: string) => string
    hasValue: boolean
    status?: SpecialProvisionStatus
    onClickAccept: () => void
    onClickDecline: () => void
  }) => {
    const {
      className,
      t,
      hasValue,
      status,
      onClickAccept,
      onClickDecline,
    } = props
    return (
      <>
        <div className={className}>
          <div>
            {status === SpecialProvisionStatus.Accepted && (
              <ChangeButton onClick={onClickDecline}>
                {t('NEGOTIATE_DECLINE')}
              </ChangeButton>
            )}
            {status === SpecialProvisionStatus.Declined && (
              <ChangeButton onClick={onClickAccept}>
                {t('NEGOTIATE_ACCEPT')}
              </ChangeButton>
            )}
          </div>
          <div>
            {status === SpecialProvisionStatus.Created ? (
              <>
                <DeclineButton onClick={onClickDecline}>
                  {t('NEGOTIATE_DECLINE')}
                </DeclineButton>
                <AcceptButton onClick={onClickAccept}>
                  {t('NEGOTIATE_ACCEPT')}
                </AcceptButton>
              </>
            ) : (
              <div>
                <StatusText status={status}>
                  {hasValue && t(statusMessage(status))}
                </StatusText>
              </div>
            )}
          </div>
        </div>
        {status === SpecialProvisionStatus.Created ||
        status === SpecialProvisionStatus.Declined ? (
          <TextAccepting>
            {t('NEGOTIATE_SPECIAL_PROVISION_ACCEPTING')}
          </TextAccepting>
        ) : null}
      </>
    )
  },
)`
  display: flex;
  justify-content: space-between;
  div:last-child {
    display: flex;
    justify-content: flex-end;
  }
`

const SpecialProvisions = (props: {
  className?: string
  disabled: boolean
}) => {
  const { className, disabled } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const negotiation = useSelector(selectors.getNegotiation)
  const [showForm, setShowForm] = useState(false)
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const isLandlord = useSelector(userSelectors.isLandlord)
  const specialProvisions = get(negotiation, 'specialProvision', '')
  const provStatus =
    specialProvisions !== ''
      ? get(negotiation, 'specialProvisionStatus')
      : undefined

  const enquiry = useSelector(enquirySelectors.getEnquiry)
  const enquiryStatus = get(enquiry, 'enquireStatus')
  const isEnquiryPending =
    specialProvisions &&
    specialProvisions.trim().length !== 0 &&
    enquiryStatus === TermStatus.Pending
  const isOK = provStatus === SpecialProvisionStatus.Accepted
  const isKO = provStatus === SpecialProvisionStatus.Declined
  const showRejected = isKO && isLandlord
  const showInfo = showForm || (!specialProvisions && !showRejected)
  const showBox = !showInfo
  const showTenantRejected = isKO && !isLandlord

  useEffect(() => {
    setValue(specialProvisions)
  }, [setValue, specialProvisions])

  const scrub = (val: string) => {
    if (val.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
      val = ' '
    }
    return val
  }

  const onTAChange = (val: string) => {
    val = scrub(val)
    setValue(val)
  }

  const onSave = () => {
    if (disabled) return
    const scrubbed = scrub(value)
    setShowForm(false)
    setValue(scrubbed)
    dispatch(actions.saveSpecialProvisions(scrubbed))
  }

  const onCancel = () => {
    onTAChange(specialProvisions)
    setShowForm(false)
  }

  const remove = () => {
    if (disabled) return
    dispatch(actions.saveSpecialProvisions(' '))
    setShowForm(false)
  }

  const decline = () => {
    if (disabled) return
    dispatch(actions.rejectSpecialProvisions())
  }

  const accept = () => {
    if (disabled) return
    dispatch(actions.acceptSpecialProvisions())
  }

  if (isEnquiryPending) {
    return (
      <Container className={className}>
        <LeaseTemplate
          disabled={disabled}
          flex={enquiry ? enquiry.flex : false}
        />
        <p>{t('SPECIAL_PROV_PENDING_MSG')}</p>
      </Container>
    )
  }

  return (
    <Container className={className}>
      <LeaseTemplate
        disabled={disabled}
        flex={enquiry ? enquiry.flex : false}
      />
      {<Info t={t} isLandlord={isLandlord} />}
      {showRejected && (
        <RejectedBox>{t('SPECIAL_PROV_REJECT_MSG')}</RejectedBox>
      )}
      {showTenantRejected && (
        <RejectedBox>{t('SPECIAL_PROV_TENANT_REJECT_MSG')}</RejectedBox>
      )}
      {showBox && value && value.trim().length > 0 && (
        <Box status={provStatus}>
          <CloseIcon
            data-testid="removeSP"
            onClick={remove}
            isVisible={isLandlord}
          />
          {isOK && !disabled && (
            <CheckCircle fontSize="default" htmlColor="#6CB9D5" />
          )}
          <HTMLContent html={value} />
        </Box>
      )}
      {showForm && isLandlord ? (
        <Form>
          <h3>{t('SPECIAL_PROV_FORM_TITLE')}</h3>
          <RichTextArea
            id="specialProvision"
            value={value}
            label={t('SPECIAL_PROV_FORM_LABEL')}
            onChange={onTAChange}
            rows={7}
          />
          <FormActions>
            <CancelButton onClick={onCancel}>
              {t('SPECIAL_PROV_CANCEL')}
            </CancelButton>
            <SaveButton onClick={onSave}>{t('SPECIAL_PROV_SAVE')}</SaveButton>
          </FormActions>
        </Form>
      ) : disabled ? null : (
        <>
          {isLandlord ? (
            <LandlordActions
              t={t}
              status={provStatus}
              hasValue={value && value.trim().length > 0 ? true : false}
              onClickModify={() => setShowForm(true)}
              onClickAdd={() => setShowForm(true)}
            />
          ) : (
            <TenantActions
              t={t}
              hasValue={value && value.trim().length > 0 ? true : false}
              status={provStatus}
              onClickAccept={accept}
              onClickDecline={decline}
            />
          )}
        </>
      )}
    </Container>
  )
}

export default SpecialProvisions
