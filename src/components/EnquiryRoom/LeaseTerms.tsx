import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'
import { get } from 'lodash'

import device from 'services/global/device'
import selectors from 'services/negotiation/selectors'
import actions from 'services/negotiation/actions'
import { getNegotiationTermArray } from 'services/negotiation/helpers'
import {
  useNegotiationFieldsIds,
  useNegotiationTerms,
} from 'services/negotiation/hooks'
import {
  NegotiationTerms,
  TermStatus,
  DepositType,
  PaymentType,
} from 'services/negotiation/types'
import enquirySelectors from 'services/enquiry/selectors'
import userSelectors from 'services/user/selectors'
import LeaseTermView from './LeaseTermView'
import LeaseTermForm, { FormErrors } from './LeaseTermForm'

import OutlinedButton from 'components/common/OutlinedButton'
import FilledButton from 'components/common/FilledButton'
import Spinner from 'components/icons/Spinner'

const ModButton = styled(OutlinedButton)`
  box-sizing: border-box;
  min-width: 110px;
`

const CancelButton = styled(OutlinedButton)`
  color: #6cb9d5;
  background-color: #ffffff;
  box-sizing: border-box;
  min-width: 110px;
  float: right;
  margin-right: 20px;
  @media ${device.mobile} {
    margin-right: 5px;
  }
`

const SubmitButton = styled(FilledButton)`
  color: white;
  background-color: #6cb9d5;
  box-sizing: border-box;
  min-width: 110px;
  float: right;
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

const ModActions = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`
export const getLeaseStatusColor = (status: TermStatus) =>
  get(
    {
      [TermStatus.Declined]: '#DB4437',
      [TermStatus.Proposed]: '#EBBF59',
      [TermStatus.Accepted]: '#6CB9D5',
    },
    status,
    '#CECECE',
  )

const StatusText = styled.span<{ status: TermStatus }>`
  color: ${props => getLeaseStatusColor(props.status)};
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  text-align: right;
`

const TermsHeading = styled.h2`
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;
  margin-bottom: 5px;
`

const Container = styled.div`
  @media ${device.mobile} {
    margin: 0;
  }
`

const TermActions = styled.div`
  margin-top: 20px;
  min-height: 50px;
`

const RejectedBox = styled.div`
  padding: 5px;
  margin-bottom: 15px;
  border: 1px solid #ebbf59;
  background-color: rgba(235, 191, 89, 0.3);
  font-weight: 500;
`

const TextAccepting = styled.div`
  color: #6d6c6c;
  font-size: 14px;
  font-weight: 400;
  text-align: right;
  float: right;
  padding-top: 10px;
  width: 270px;
`

const LeaseTerms = (props: { disabled: boolean }) => {
  const { disabled } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const [edit, setEdit] = useState(false)
  const isLandlord = useSelector(userSelectors.isLandlord)
  const enquiry = useSelector(enquirySelectors.getEnquiry)
  const enquiryStatus = get(enquiry, 'enquireStatus')
  const landlordId = get(enquiry, 'peer2Id')
  const status = useSelector(selectors.getStatus)

  const initialTerms = useNegotiationTerms()
  if (initialTerms) {
    if (!initialTerms.depositType) {
      initialTerms.depositType = DepositType.Cash
    }
    if (!initialTerms.frequency) {
      initialTerms.frequency = PaymentType.Monthly
    }
  }
  const fieldIds = useNegotiationFieldsIds()
  const [terms, setTerms] = useState(initialTerms)
  const [formErrors, setErrors] = useState({} as FormErrors)

  useEffect(() => {
    if (initialTerms) {
      setTerms(initialTerms)
    }
  }, [initialTerms, setTerms])

  useEffect(() => {
    if (isLandlord && status === TermStatus.Created) {
      setEdit(true)
    }
  }, [isLandlord, status])

  const requiredNum = (x: any) => {
    if (isNaN(x) || x === '') return t('VAL_REQUIRED')
    if (x < 0) return t('VAL_INVALID')
    return undefined
  }

  const valDate = (x: any) => {
    const d = moment(x)
    if (!d.isValid()) return t('VAL_NULL')
    return undefined
  }

  const validate = (terms: NegotiationTerms) => {
    const errors: FormErrors = {}
    if (!enquiry.flex) {
      errors.area = requiredNum(terms.area)
      errors.deposit = requiredNum(terms.deposit)
      errors.serviceCharges = requiredNum(terms.serviceCharges)
    } else {
      errors.noOfDesks = requiredNum(terms.noOfDesks)
    }
    errors.duration = requiredNum(terms.duration)
    errors.rent = requiredNum(terms.rent)
    errors.start = valDate(terms.start)

    // remove undefined fields
    const acc: FormErrors = Object.keys(errors).reduce((acc, key) => {
      if (errors[key] !== undefined) acc[key] = errors[key]
      return acc
    }, {} as FormErrors)
    return acc
  }

  const update = (val: NegotiationTerms) => {
    const errors = validate(val)
    setErrors(errors)
    setTerms(val)
  }

  const onCancel = () => {
    setEdit(false)
    setTerms(initialTerms)
  }
  const onAccept = () => {
    dispatch(actions.accept())
  }
  const onDecline = () => {
    dispatch(actions.reject())
  }
  const onSubmit = () => {
    const errors = validate(terms)
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
    } else {
      const values = getNegotiationTermArray(terms, fieldIds)
      dispatch(actions.putCounter(values))
      setEdit(false)
    }
  }

  if (
    enquiryStatus === TermStatus.Pending ||
    (!isLandlord && status === TermStatus.Created)
  ) {
    return (
      <Container>
        <p>{t('NEGOTIATE_EXPLANATION_LEASE_TERMS')}</p>
      </Container>
    )
  }

  if (enquiry === undefined) {
    return (
      <Container>
        <Spinner />
      </Container>
    )
  }

  return (
    <Container>
      {status !== TermStatus.Accepted && status !== TermStatus.Declined && (
        <TermsHeading>
          {isLandlord
            ? t('NEGOTIATE_YOUR_TERMS_LANDLORD')
            : t('NEGOTIATE_YOUR_TERMS')}
        </TermsHeading>
      )}
      {status === TermStatus.Declined && (
        <RejectedBox>
          {isLandlord
            ? t('NEGOTIATE_REJECT_MSG')
            : t('NEGOTIATE_TENANT_REJECT_MSG')}
        </RejectedBox>
      )}
      {!disabled && edit ? (
        <LeaseTermForm
          terms={terms}
          setTerms={update}
          errors={formErrors}
          isFlex={enquiry.flex}
          flexType={enquiry.flexType}
        />
      ) : (
        <LeaseTermView
          status={status}
          terms={terms}
          userId={landlordId}
          isFlex={enquiry.flex}
          flexType={enquiry.flexType}
          disabled={disabled}
        />
      )}
      {disabled ? null : isLandlord ? (
        <>
          {edit ? (
            <TermActions>
              <SubmitButton data-testid="submit" onClick={onSubmit}>
                {t('NEGOTIATE_SUBMIT')}
              </SubmitButton>
              <CancelButton data-testid="cancel" onClick={onCancel}>
                {t('NEGOTIATE_CANCEL')}
              </CancelButton>
            </TermActions>
          ) : (
            <ModActions>
              <div>
                <ModButton
                  data-testid="modify"
                  onClick={() => {
                    setEdit(true)
                  }}>
                  {t('NEGOTIATE_MODIFY')}
                </ModButton>
              </div>
              <div>
                <StatusText status={status}>
                  {get(
                    {
                      [TermStatus.Accepted]: t('NEGOTIATE_STATUS_ACCEPTED'),
                      [TermStatus.Declined]: t('NEGOTIATE_STATUS_REJECTED'),
                      [TermStatus.Proposed]: t(
                        'NEGOTIATE_STATUS_WAITING_CONFIRMATION',
                      ),
                    },
                    status,
                  )}
                </StatusText>
              </div>
            </ModActions>
          )}
        </>
      ) : status === TermStatus.Accepted || status === TermStatus.Declined ? (
        <ModActions>
          <div>
            {status === TermStatus.Accepted ? (
              <ChangeButton data-testid="decline" onClick={onDecline}>
                {t('NEGOTIATE_DECLINE')}
              </ChangeButton>
            ) : (
              <ChangeButton data-testid="accept" onClick={onAccept}>
                {t('NEGOTIATE_ACCEPT')}
              </ChangeButton>
            )}
          </div>
          <div>
            <StatusText status={status}>
              {t(
                status === TermStatus.Accepted
                  ? 'NEGOTIATE_STATUS_ACCEPTED'
                  : 'NEGOTIATE_STATUS_REJECTED',
              )}
            </StatusText>
          </div>
        </ModActions>
      ) : (
        <TermActions>
          <SubmitButton data-testid="accept" onClick={onAccept}>
            {t('NEGOTIATE_ACCEPT')}
          </SubmitButton>
          <CancelButton data-testid="decline" onClick={onDecline}>
            {t('NEGOTIATE_DECLINE')}
          </CancelButton>
        </TermActions>
      )}
      {status === TermStatus.Proposed || status === TermStatus.Declined ? (
        <TextAccepting>
          {isLandlord ? null : t('NEGOTIATE_SPECIAL_PROVISION_ACCEPTING')}
        </TextAccepting>
      ) : null}
    </Container>
  )
}

export default LeaseTerms
