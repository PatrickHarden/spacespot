import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'
import moment from 'moment'

import Input from 'components/common/Input'
import DatePicker from 'components/common/DatePicker'
import { EnquiryRequest } from 'services/enquiry/types'
import actions from 'services/enquiry/actions'
import negotiationActions from 'services/negotiation/actions'
import selectors from 'services/negotiation/selectors'
import user from 'services/user/selectors'
import { NegotiationTerm } from 'services/negotiation/types'
import CheckBox from 'components/common/CheckBox'
import FilledButton from 'components/common/FilledButton'

import { invalidEmail, invalidPassword } from 'services/global/util'
import device from 'services/global/device'
import { getLangPrefix } from 'intl'
import { b2cRegister, b2cLogin } from 'services/user/b2c'
import Spinner from 'components/icons/Spinner'
import toaster from 'services/toaster/actions'

const DialogActionsFrame = styled.div`
  margin: 10px 15px;
`

const DialogTitle1 = styled(DialogTitle)`
  padding-bottom: 0;
  h2 {
    font-size: 25px;
    font-weight: 500;
    line-height: 30px;
  }
  svg {
    position: absolute;
    right: 25px;
    top: 10px;
    cursor: pointer;
  }
`

const Button = styled(FilledButton)`
  background-color: #404042;
  color: #fffff0;
  outline: none;
  text-align: center;
  margin-left: 24px;
  @media ${device.mobile} {
    margin: 0;
  }
`

const Heading = styled.h2`
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  line-height: 21px;
`
const HeadingPaddingBottom = styled(Heading)`
  padding-top: 25px;
`

const MsgBox = styled.textarea`
  margin-top: 8px;
  min-height: 120px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  resize: none;
  font-size: 16px;
  @media ${device.mobile} {
    width: 98%;
  }
`

const Form = styled.div`
  min-height: 120px;
  border-radius: 2px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: row;
  @media ${device.mobile} {
    width: 100%;
    flex-wrap: wrap;
  }
`

const FormRow = styled.div`
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  div:first-child {
    margin-right: 10px;
  }
  @media ${device.mobile} {
    width: 100%;
    flex-direction: column;
  }
`

const FormCol1 = styled.div`
  flex: 1 1 auto;
  max-width: 140px;
  margin: 10px 5px;
  padding: 5px;

  @media ${device.mobile} {
    max-width: 100%;
  }
`
const FormCol2 = styled.div`
  border-left: 1px solid #dddddd;
  flex: 1 1 auto;
  margin: 10px 5px 10px 0;
  padding: 5px 5px 5px 10px;
  @media ${device.mobile} {
    margin: 0 10px 10px;
    padding: 0;
    border: 0;
    width: 100%;
  }
`
const Label = styled.label`
  padding-left: 6px;
  padding-bottom: 2px;
  color: #404042;
  font-size: 16px;
  font-weight: 400;
`
const HalfInput = styled(Input)`
  width: 50%;
  margin: 10px 0 20px 0;

  @media ${device.mobile} {
    width: 100%;
    margin: 10px 0;
  }
`

const SignIn = styled.button`
  color: #f35c2b;
  font-size: 16px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-left: 5px;
`

const Notice = styled.p`
  margin-left: 14px;
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  @media ${device.mobile} {
    width: 100%;
    margin: 0;
    padding: 10px;
    word-break: break-all;
  }
  a {
    color: #f35c2b;
    text-decoration: none;
  }
`

const PWErrorDisplay = styled.div`
  padding: 5px;
  ul {
    margin-top: 0;
  }
`
const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`

interface EnquiryRequestData {
  start: Date | null
  duration: string
  flexible: boolean
  message: string
  name: string
  company: string
  errors: {
    start?: string
    duration?: string
    email?: string
    email2?: string
    password?: string
    password2?: string
  }
  email?: string
  email2?: string
  password?: string
  password2?: string
}

/**
 * Enquiry Dialog
 */
const EnquiryDialogFixed = (props: {
  open: boolean
  setOpen: (value: boolean) => void
}) => {
  const { open, setOpen } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { spaceId } = useParams<{ spaceId: string }>()
  const fieldIds = useSelector(selectors.getNegotiationFieldIds)
  const dispatch = useDispatch()
  const prefix = getLangPrefix()
  const isLogged = useSelector(user.isLogged)

  const defaultData: EnquiryRequestData = {
    start: null,
    duration: '',
    flexible: true,
    message: t('ENQUIRY_DIALOG_DEAFULT_MESSAGE'),
    name: '',
    company: '',
    email: '',
    email2: '',
    password: '',
    password2: '',
    errors: {},
  }
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(false)
      if (!fieldIds) {
        dispatch(negotiationActions.getFields())
      }
    }
  }, [open, dispatch, fieldIds])

  const signin = () => {
    b2cLogin()
  }

  const validateDuration = (ndata: EnquiryRequestData) => {
    ndata.errors && ndata.errors.duration && delete ndata.errors.duration
    const duration = parseInt(ndata.duration)
    if (duration < 1 || isNaN(duration)) {
      ndata.errors.duration = t('VAL_GT_ZERO')
    }
  }

  const validateStart = (ndata: EnquiryRequestData) => {
    ndata.errors && ndata.errors.start && delete ndata.errors.start
    if (!ndata.start) {
      ndata.errors.start = t('VAL_NULL')
    }
  }

  const validateEmail = (ndata: EnquiryRequestData) => {
    ndata.errors && ndata.errors.email && delete ndata.errors.email
    if (!isLogged && invalidEmail(ndata.email || '')) {
      ndata.errors.email = t('VAL_INVALID')
    }
  }

  const validateEmail2 = (ndata: EnquiryRequestData) => {
    ndata.errors && ndata.errors.email2 && delete ndata.errors.email2
    if (!isLogged && ndata.email !== ndata.email2) {
      ndata.errors.email2 = t('VAL_MATCH')
    }
  }

  const validatePassword = (ndata: EnquiryRequestData) => {
    ndata.errors && ndata.errors.password && delete ndata.errors.password
    ndata.errors && ndata.errors.password2 && delete ndata.errors.password2
    if (!isLogged && invalidPassword(ndata.password || '')) {
      ndata.errors.password = t('PASSWORD_INVALID')
    }
  }

  const validatePassword2 = (ndata: EnquiryRequestData) => {
    ndata.errors && ndata.errors.password2 && delete ndata.errors.password2
    if (!isLogged && ndata.password !== ndata.password2) {
      ndata.errors.password2 = t('PASSWORD_MATCH')
    }
  }

  const validate = (ndata: EnquiryRequestData) => {
    ndata.errors = {}
    validateDuration(ndata)
    validateStart(ndata)
    validateEmail(ndata)
    validateEmail2(ndata)
    validatePassword(ndata)
    validatePassword2(ndata)
    return Object.keys(ndata.errors).length > 0
  }

  const onChangeDate = (value?: string | null) => {
    if (value && value !== '') {
      value = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') as string
      const ndata = { ...data, start: new Date(value) }
      validateStart(ndata)
      setData(ndata)
    }
  }

  const generateErrorText = (err: any): string => {
    let errorText: string = t('ENQUIRY_SUBMIT_ERROR')
    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data.returnCode
    ) {
      switch (err.response.data.returnCode) {
        case 'SS2001':
          errorText = t('ERROR_TEXT_SS2001')
          break
        case 'SS2002':
          errorText = t('ERROR_TEXT_SS2002')
          break
      }
    }
    return errorText
  }

  const getAdditionalInfoMessage = () =>
    data.name !== ''
      ? `- ${data.name}${data.company !== '' ? ', ' + data.company : ''}`
      : data.company !== ''
      ? `- ${data.company}`
      : ''

  const onClick = async () => {
    const ndata = { ...data }
    if (validate(ndata)) {
      setData(ndata)
      return
    }
    if (!spaceId || !fieldIds) {
      setOpen(false)
      return
    }
    const terms: Array<NegotiationTerm> = [
      {
        termId: fieldIds['duration'],
        value: data.duration.toString(),
      },
      {
        termId: fieldIds['start'],
        value: data.start ? data.start.toISOString() : '',
      },
    ]
    const request: EnquiryRequest = {
      spaceId: spaceId,
      message: get(data, 'message', '') + getAdditionalInfoMessage(),
      negotiation: {
        flexible: data.flexible,
        terms,
      },
      loggedIn: isLogged,
    }
    try {
      setLoading(true)
      if (!isLogged) {
        const userData = await b2cRegister(
          data.name,
          data.company,
          data.email || '',
          data.password || '',
        )
        const { userId } = userData
        request.userId = userId
      }
      request.apiResultActions = {
        successSignInAfter: !isLogged ? true : false,
        errorShowMessage: !isLogged
          ? t('ENQUIRY_SUBMIT_ERROR_AFTER_REGISTRATION')
          : undefined,
      }
      setLoading(false)
      dispatch(actions.init(request))
    } catch (err) {
      const errorText: string = generateErrorText(err)
      dispatch(toaster.showError(errorText))
      setLoading(false)
    }
    setOpen(false)
  }

  const displayPasswordError = () => {
    return (
      <PWErrorDisplay>
        {t('PASSWORD_RULES_LENGTH')}
        <br />
        {t('PASSWORD_RULES_AT_LEAST')}
        <br />
        <ul>
          <li>{t('PASSWORD_RULES_LOWERCASE')}</li>
          <li>{t('PASSWORD_RULES_UPPERCASE')}</li>
          <li>{t('PASSWORD_RULES_DIGIT')}</li>
          <li>{t('PASSWORD_RULES_SYMBOL')}</li>
        </ul>
      </PWErrorDisplay>
    )
  }

  const loadingDisplay = () => {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    )
  }

  const formDisplay = () => {
    return (
      <>
        {!isLogged && (
          <p>
            {t('ENQUIRY_DIALOG_REGISTERED')}
            <SignIn onClick={signin}>{t('ENQUIRY_DIALOG_SIGNIN')}</SignIn>
          </p>
        )}
        <Heading>{t('ENQUIRY_DIALOG_SUBTITLE')}</Heading>
        <form>
          <Form>
            <FormCol1>
              <Input
                id="length"
                label={`${t('NEGOTIATE_LENGTH')} (${t('NEGOTIATE_MONTHS')})`}
                type="number"
                min="1"
                value={data.duration}
                error={data.errors.duration}
                onChange={e => {
                  if (e.target.value !== '') {
                    const ndata = { ...data, duration: e.target.value }
                    validateDuration(ndata)
                    setData(ndata)
                  }
                }}
              />
            </FormCol1>
            <FormCol2>
              <DatePicker
                id="start"
                format="dd.MM.yyyy"
                placeholder={t('PLACE_HOLDER_DATE_FORMAT')}
                label={t('NEGOTIATE_MOVE_IN_BY')}
                value={data.start}
                error={data.errors.start}
                disablePast
                onChange={onChangeDate}
              />
              <CheckBox
                checked={data.flexible}
                onChange={e => {
                  const ndata = { ...data, flexible: e.target.checked }
                  setData(ndata)
                }}>
                {t('NEGOTIATE_FLEXIBLE')}
              </CheckBox>
            </FormCol2>
          </Form>
          <HeadingPaddingBottom>
            {t('ENQUIRY_DIALOG_ADDITIONAL_INFO')}
          </HeadingPaddingBottom>
          <HalfInput
            id="enquiry_your_name"
            placeholder={`${t('ENQUIRY_DIALOG_NAME')}`}
            type="text"
            value={data.name}
            onChange={e => {
              const ndata = { ...data, name: e.target.value }
              setData(ndata)
            }}
          />
          {!isLogged && (
            <FormRow>
              <HalfInput
                id="enquiry_email"
                placeholder={`${t('ENQUIRY_DIALOG_EMAIL')}`}
                type="text"
                value={data.email}
                error={data.errors.email}
                onChange={e => {
                  const ndata = { ...data, email: e.target.value }
                  validateEmail(ndata)
                  setData(ndata)
                }}
              />
              <HalfInput
                id="enquiry_email2"
                placeholder={`${t('ENQUIRY_DIALOG_EMAIL2')}`}
                type="text"
                value={data.email2}
                error={data.errors.email2}
                onChange={e => {
                  const ndata = { ...data, email2: e.target.value }
                  validateEmail2(ndata)
                  setData(ndata)
                }}
              />
            </FormRow>
          )}
          <HalfInput
            id="enquiry_company_name"
            placeholder={`${t('ENQUIRY_DIALOG_COMPANY')}`}
            type="text"
            value={data.company}
            onChange={e => {
              const ndata = { ...data, company: e.target.value }
              setData(ndata)
            }}
          />
          {!isLogged && (
            <>
              <Label> {t('ENQUIRY_DIALOG_PASSWORD')}</Label>
              <FormRow>
                <HalfInput
                  id="enquiry_password"
                  type="password"
                  value={data.password}
                  placeholder={`${t('ENQUIRY_DIALOG_PASSWORD_PLC_HLD')}`}
                  popover={
                    data.errors.password
                      ? {
                          buttonText: t('PASSWORD_RULES_BUTTON_TEXT'),
                          displayFunction: displayPasswordError,
                        }
                      : undefined
                  }
                  error={data.errors.password}
                  onChange={e => {
                    const ndata = { ...data, password: e.target.value }
                    validatePassword(ndata)
                    setData(ndata)
                  }}
                />
                <HalfInput
                  id="enquiry_confirm_password"
                  type="password"
                  value={data.password2}
                  placeholder={`${t('ENQUIRY_DIALOG_PASSWORD_PLC_HLD2')}`}
                  error={data.errors.password2}
                  onChange={e => {
                    const ndata = { ...data, password2: e.target.value }
                    validatePassword2(ndata)
                    setData(ndata)
                  }}
                />
              </FormRow>
            </>
          )}
          <Label> {t('ENQUIRY_DIALOG_MESSAGE')}</Label>
          <MsgBox
            onChange={e => setData({ ...data, message: e.target.value })}
            value={data.message}
          />
        </form>
      </>
    )
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle1>
        {loading ? t('ENQUIRY_SAVING_TEXT') : t('ENQUIRY_DIALOG_TITLE')}
        {!loading && <Close onClick={() => setOpen(false)} />}
      </DialogTitle1>
      <DialogContent>
        {loading ? loadingDisplay() : formDisplay()}
      </DialogContent>
      <DialogActions>
        {!isLogged && !loading && (
          <Notice>
            {t('ENQUIRY_DIALOG_NOTICE')}&nbsp;
            <Link to={`${prefix}/terms`}>
              {t('ENQUIRY_DIALOG_NOTICE_TERMS')}
            </Link>
            &nbsp;{t('ENQUIRY_DIALOG_NOTICE_AND')}&nbsp;
            <Link to={`${prefix}/privacy`}>
              {t('ENQUIRY_DIALOG_NOTICE_PRIVACY')}
            </Link>
          </Notice>
        )}
        <DialogActionsFrame>
          {!loading && (
            <Button
              id="dialogOK"
              data-testid="submit-enquiry-dialog-ok"
              data-auto="submit-enquiry-dialog-fixed"
              color="primary"
              autoFocus
              onClick={onClick}>
              {t('ENQUIRY_DIALOG_BUTTON')}
            </Button>
          )}
        </DialogActionsFrame>
      </DialogActions>
    </Dialog>
  )
}

export default EnquiryDialogFixed
