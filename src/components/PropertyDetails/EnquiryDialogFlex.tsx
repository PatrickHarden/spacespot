import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from '@material-ui/core'
import { get } from 'lodash'
import Close from '@material-ui/icons/Close'

import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

import user from 'services/user/selectors'
import Input from 'components/common/Input'
import DatePicker from 'components/common/DatePicker'
import Chevron from 'components/icons/Chevron'

import { EnquiryRequestFlex, EnquiryType } from 'services/enquiry/types'
import actions from 'services/enquiry/actions'
import negotiationActions from 'services/negotiation/actions'
import selectors from 'services/negotiation/selectors'
import spaceSelectors from 'services/space/selectors'
import { NegotiationTerm } from 'services/negotiation/types'
import FilledButton from 'components/common/FilledButton'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { AvailabilityFlex } from 'services/onboarding/types'
import device from 'services/global/device'
import {
  invalidEmail,
  getCurrencyDesc,
  invalidPassword,
} from 'services/global/util'
import { getLangPrefix } from 'intl'
import { b2cRegister, b2cLogin } from 'services/user/b2c'
import Spinner from 'components/icons/Spinner'
import toaster from 'services/toaster/actions'
import moment from 'moment'

const RadioButtonLabel = styled(FormControlLabel)`
  .MuiFormControlLabel-label {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    text-overflow: ellipsis;
  }
  .MuiIconButton-label,
  .MuiIconButton-root {
    color: #6cb9d5;
    padding: 3px;
  }
  .MuiButtonBase-root:hover,
  .Mui-checked.MuiButtonBase-root:hover {
    background-color: rgba(108, 185, 213, 0.2);
  }
`
const ContainerRadio = styled.div`
  margin-left: 0px;
  .MuiFormControlLabel-root {
    margin-left: 0;
    width: 100%;
  }
`
const DialogActionsFrame = styled.div`
  margin: 10px 15px;
  @media ${device.mobile} {
    margin: 15px 0;

    button {
      margin: 0 5px;
    }
  }
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
    width: 100%;
  }
`

const Form = styled.div`
  min-height: 170px;
  border-radius: 2px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  @media ${device.mobile} {
    flex-wrap: wrap;
    width: calc(100% - 20px);
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
  max-width: 100%;

  @media ${device.mobile} {
    width: 100%;
  }
`
const FormCol2 = styled.div`
  flex: 1 1 auto;
`
const FormCol3 = styled.div`
  flex: 1 1 auto;
  margin: 15px 0 0;
  padding: 0;
  @media ${device.mobile} {
    width: 100%;
  }
`
const FormCol4 = styled.div`
  margin-top: 12px;
`
const DatePickerStyled = styled(DatePicker)`
  margin-bottom: 10px;
`
const SelectOffice = styled(Select)`
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  padding: 2px 0px 2px 10px;
  :before,
  :focus,
  :hover,
  :after {
    border-bottom: 1px solid #ced4da !important;
    transition: none;
    content: '';
    background-color: transparent !important;
  }

  .MuiSelect-select:focus {
    background-color: transparent !important;
  }
  .MuiSelect-select.MuiSelect-select {
    position: relative;
    z-index: 10;
  }
  svg {
    position: absolute;
    right: 10px;
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

const ErrorText = styled.div`
  color: #f35c2b;
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

const ErrorSelectOffice = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #db4437;
  display: block;
`
interface EnquiryRequestFlexData {
  start: Date | null
  duration: string
  people: string
  type: EnquiryType
  message: string
  servicesOffice: string
  name: string
  company: string
  errors: {
    type?: string
    start?: string
    duration?: string
    people?: string
    email?: string
    email2?: string
    password?: string
    password2?: string
    servicesOffice?: string
  }
  email?: string
  email2?: string
  password?: string
  password2?: string
}

/**
 * Enquiry Dialog
 */
const EnquiryDialogFlex = (props: {
  open: boolean
  setOpen: (value: boolean) => void
}) => {
  const { open, setOpen } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { spaceId } = useParams<{ spaceId: string }>()
  const space = useSelector(spaceSelectors.selectedSpace)
  const hotDesks = spaceSelectors.getFlexAvailability(
    space,
    'HotDesk',
  ) as AvailabilityFlex
  const fixedDesks = spaceSelectors.getFlexAvailability(
    space,
    'FixedDesk',
  ) as AvailabilityFlex
  const servicedOffice = spaceSelectors.getFlexAvailability(
    space,
    'ServicedOffice',
  ) as Array<AvailabilityFlex>
  const fieldIds = useSelector(selectors.getNegotiationFieldIds)
  const dispatch = useDispatch()
  const prefix = getLangPrefix()
  const isLogged = useSelector(user.isLogged)

  useEffect(() => {
    if (open && !fieldIds) {
      dispatch(negotiationActions.getFields())
    }
  }, [open, dispatch, fieldIds])

  const defaultData: EnquiryRequestFlexData = {
    start: null,
    people: '',
    duration: '',
    message: t('ENQUIRY_DIALOG_DEAFULT_MESSAGE'),
    servicesOffice: '',
    name: '',
    company: '',
    type: EnquiryType.notChecked,
    email: '',
    email2: '',
    password: '',
    errors: {},
  }
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!data.type) {
      data.type = hotDesks
        ? (data.type = EnquiryType.HotDesk)
        : fixedDesks
        ? EnquiryType.FixedDesk
        : servicedOffice
        ? EnquiryType.ServicedOffice
        : EnquiryType.notChecked
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMaxDesks = () => {
    if (data.type === EnquiryType.HotDesk) {
      return hotDesks.desks
    }
    if (data.type === EnquiryType.FixedDesk) {
      return fixedDesks.desks
    }
    return 0
  }

  const validateType = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.type && delete ndata.errors.type
    if (!ndata.type || ndata.type.length === 0) {
      ndata.errors.type = t('VAL_INVALID')
    }
  }

  const validateDuration = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.duration && delete ndata.errors.duration
    const duration = parseInt(ndata.duration)
    if (duration < 1 || isNaN(duration)) {
      ndata.errors.duration = t('VAL_GT_ZERO')
    }
  }

  const validatePeople = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.people && delete ndata.errors.people
    const people = parseInt(ndata.people)
    if (
      (people < 1 || isNaN(people)) &&
      ndata.type !== EnquiryType.ServicedOffice
    ) {
      ndata.errors.people = t('VAL_GT_ZERO')
    }
    if (
      ndata.type === EnquiryType.HotDesk ||
      ndata.type === EnquiryType.FixedDesk
    ) {
      const maxDesks = getMaxDesks()
      if (people > maxDesks) {
        ndata.errors.people = formatMessage(
          { id: 'VAL_MAX_CAPACITY' },
          { number: maxDesks },
        )
      }
    }
  }

  const validateStart = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.start && delete ndata.errors.start
    if (!ndata.start) {
      ndata.errors.start = t('VAL_NULL')
    }
  }

  const validateEmail = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.email && delete ndata.errors.email
    if (!isLogged && invalidEmail(ndata.email || '')) {
      ndata.errors.email = t('VAL_INVALID')
    }
  }

  const validateEmail2 = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.email2 && delete ndata.errors.email2
    if (!isLogged && ndata.email !== ndata.email2) {
      ndata.errors.email2 = t('VAL_MATCH')
    }
  }

  const validatePassword = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.password && delete ndata.errors.password
    ndata.errors && ndata.errors.password2 && delete ndata.errors.password2
    if (!isLogged && invalidPassword(ndata.password || '')) {
      ndata.errors.password = t('PASSWORD_INVALID')
    }
  }

  const validatePassword2 = (ndata: EnquiryRequestFlexData) => {
    ndata.errors && ndata.errors.password2 && delete ndata.errors.password2
    if (!isLogged && ndata.password !== ndata.password2) {
      ndata.errors.password2 = t('PASSWORD_MATCH')
    }
  }
  const validateServiced = (ndata: EnquiryRequestFlexData) => {
    ndata.errors &&
      ndata.errors.servicesOffice &&
      delete ndata.errors.servicesOffice
    if (!ndata.servicesOffice && ndata.type === EnquiryType.ServicedOffice) {
      ndata.errors.servicesOffice = t('VAL_NULL')
    }
  }

  const validate = (ndata: EnquiryRequestFlexData) => {
    ndata.errors = {}
    validateType(ndata)
    validateDuration(ndata)
    validatePeople(ndata)
    validateStart(ndata)
    validateServiced(ndata)
    validateEmail(ndata)
    validateEmail2(ndata)
    validatePassword(ndata)
    validatePassword2(ndata)
    return Object.keys(ndata.errors).length > 0
  }

  const onChangeDate = (value?: string | null) => {
    if (value) {
      value = moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') as string
      const ndata = { ...data, start: new Date(value) }
      validateStart(ndata)
      setData(ndata)
    }
  }
  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    validateFunction: Function,
  ) => {
    if (e.target.value !== '') {
      const ndata = { ...data, [type]: Number(e.target.value) }
      validateFunction(ndata)
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

  const signin = () => {
    b2cLogin()
  }

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
        termId: Number(fieldIds['duration']),
        value: data.duration.toString(),
      },
      {
        termId: Number(fieldIds['start']),
        value: data.start ? data.start.toISOString() : '',
      },
    ]
    if (
      ndata.type === EnquiryType.HotDesk ||
      ndata.type === EnquiryType.FixedDesk
    ) {
      terms.push({
        termId: Number(fieldIds['noOfDesks']),
        value: data.people.toString(),
      })
    }
    const request: EnquiryRequestFlex = {
      spaceId: spaceId,
      flex: true,
      flexIdentifier: get(data, 'servicesOffice', '1'),
      flexType: data.type,
      message: get(data, 'message', '') + getAdditionalInfoMessage(),
      negotiation: {
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
      setLoading(false)
      request.apiResultActions = {
        successSignInAfter: !isLogged ? true : false,
        errorShowMessage: !isLogged
          ? t('ENQUIRY_SUBMIT_ERROR_AFTER_REGISTRATION')
          : undefined,
      }
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
        <Heading>{t('ENQUIRY_DIALOG_SUBTITLE_FLEX')}</Heading>
        <Form>
          <FormCol1>
            <ContainerRadio>
              <RadioGroup
                name="type"
                value={data.type}
                onChange={(
                  _evnet: React.ChangeEvent<HTMLInputElement>,
                  value: string,
                ) => setData({ ...data, type: value as EnquiryType })}>
                {hotDesks && hotDesks.desks > 0 ? (
                  <RadioButtonLabel
                    value={EnquiryType.HotDesk}
                    control={<Radio disableRipple={true} />}
                    label={t('ENQUIRY_DIALOG_FLEX_HOT_DESKS')}
                  />
                ) : null}
                {fixedDesks && fixedDesks.desks > 0 ? (
                  <RadioButtonLabel
                    value={EnquiryType.FixedDesk}
                    control={<Radio disableRipple={true} />}
                    label={t('ENQUIRY_DIALOG_FLEX_FIXED_DESKS')}
                  />
                ) : null}
                {servicedOffice && servicedOffice.length > 0 ? (
                  <RadioButtonLabel
                    value={EnquiryType.ServicedOffice}
                    control={<Radio disableRipple={true} />}
                    label={t('ENQUIRY_DIALOG_FLEX_SERVICED_OFFICE')}
                  />
                ) : null}
              </RadioGroup>
            </ContainerRadio>
            {data.errors.type && data.errors.type.length > 0 && (
              <ErrorText>{data.errors.type}</ErrorText>
            )}
          </FormCol1>
          {data.type === EnquiryType.ServicedOffice && servicedOffice ? (
            <FormCol3>
              <SelectOffice
                IconComponent={() => <Chevron />}
                id="servicedOffices"
                type="number"
                value={data.servicesOffice}
                className={
                  data.errors.servicesOffice ? 'flex-dialog-red-border' : ''
                }
                onChange={(
                  e: React.ChangeEvent<{ name?: string; value: unknown }>,
                ) => {
                  const ndata = {
                    ...data,
                    servicesOffice: e.target.value as string,
                  }
                  validateServiced(ndata)
                  setData(ndata)
                }}>
                {servicedOffice.map((office: AvailabilityFlex) => (
                  <MenuItem key={office.id} value={office.id}>
                    {office.desks} {t('DETAILS_SERVICED_OFFICES_PEOPLE')} -{' '}
                    {office.price} {getCurrencyDesc(office.currencyCode)} /{' '}
                    {office.frequency === 'Monthly'
                      ? t('DETAILS_SERVICED_OFFICES_MONTHLY')
                      : office.frequency}
                  </MenuItem>
                ))}
              </SelectOffice>
              {data.errors.servicesOffice ? (
                <ErrorSelectOffice>
                  {' '}
                  {data.errors.servicesOffice}
                </ErrorSelectOffice>
              ) : null}

              <FormCol4>
                <DatePickerStyled
                  format="dd.MM.yyyy"
                  placeholder={t('PLACE_HOLDER_DATE_FORMAT')}
                  id="start"
                  label={t('ENQUIRY_DIALOG_FLEX_MOVE_IN_BY')}
                  value={data.start}
                  error={data.errors.start}
                  disablePast
                  onChange={onChangeDate}
                />
                <Input
                  id="length"
                  type="number"
                  value={data.duration}
                  label={t('ENQUIRY_DIALOG_FLEX_LENGTH')}
                  error={data.errors.duration}
                  min="1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeInput(e, 'duration', validateDuration)
                  }
                />
              </FormCol4>
            </FormCol3>
          ) : null}
          {data.type === EnquiryType.HotDesk ||
          data.type === EnquiryType.FixedDesk ? (
            <>
              <FormCol2>
                <Input
                  id="desks-people"
                  type="number"
                  value={data.people}
                  label={t('ENQUIRY_DIALOG_FLEX_PEOPLE')}
                  error={data.errors.people}
                  min="1"
                  max={getMaxDesks()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeInput(e, 'people', validatePeople)
                  }
                />
              </FormCol2>
              <FormCol2>
                <DatePickerStyled
                  format="dd.MM.yyyy"
                  placeholder={t('PLACE_HOLDER_DATE_FORMAT')}
                  id="start"
                  label={t('ENQUIRY_DIALOG_FLEX_MOVE_IN_BY')}
                  value={data.start}
                  error={data.errors.start}
                  disablePast
                  onChange={onChangeDate}
                />
                <Input
                  id="length"
                  type="number"
                  value={data.duration}
                  label={t('ENQUIRY_DIALOG_FLEX_LENGTH')}
                  error={data.errors.duration}
                  min="1"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeInput(e, 'duration', validateDuration)
                  }
                />
              </FormCol2>
            </>
          ) : null}
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
        <Label> {t('ENQUIRY_DIALOG_MESSAGE')}</Label>{' '}
        <MsgBox
          onChange={e => setData({ ...data, message: e.target.value })}
          value={data.message}
        />
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
              color="primary"
              autoFocus
              onClick={onClick}
              data-auto="submit-enquiry-dialog-flex">
              {t('ENQUIRY_DIALOG_BUTTON')}
            </Button>
          )}
        </DialogActionsFrame>
      </DialogActions>
    </Dialog>
  )
}

export default EnquiryDialogFlex
