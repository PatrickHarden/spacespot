import React, { useState } from 'react'
import DateFnsUtils from '@date-io/date-fns'

import esLocale from 'date-fns/locale/es'
import nbLocale from 'date-fns/locale/nb'
import enLocale from 'date-fns/locale/en-GB'

import styled from 'styled-components'
import { useIntl } from 'react-intl'

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import calendar from 'assets/icons/calendar.svg'
import { getUserLanguage } from 'intl'

const localeMap: { [key: string]: Locale } = {
  en: enLocale,
  nb: nbLocale,
  es: esLocale,
}

const Container = styled.div<{ focusOn: boolean; error: string | undefined }>`
  && .MuiOutlinedInput-adornedEnd {
    ${props =>
      props.focusOn &&
      `border-radius: 0;
    outline: 1px solid ${props.error ? '#db4437' : '#4fbbd8'};
    border: 1px solid ${props.error ? '#db4437' : '#4fbbd8'};
    };
  `}
`

const DatePicker = styled(
  (props: {
    id: string
    value: Date | null
    label: string
    onChange: (value?: string | null) => void
    className?: string
    dataTestId?: string
    disablePast?: boolean
    error?: string
    format?: string
    placeholder?: string
  }) => {
    const {
      id,
      value,
      label,
      onChange,
      dataTestId,
      className,
      disablePast,
      error,
      format,
      placeholder,
    } = props

    const [focusOn, setFocusOn] = useState(false)
    const lang = getUserLanguage()
    const locale = localeMap[lang] || enLocale
    const { formatMessage } = useIntl()
    const t = (s: string) => formatMessage({ id: s })
    const handleChange = (
      _date: MaterialUiPickersDate,
      value?: string | null,
    ) => {
      onChange(value)
    }

    return (
      <Container focusOn={focusOn} error={error} className={`${className}`}>
        <label>{label}</label>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
          <KeyboardDatePicker
            id={id}
            placeholder={placeholder}
            disableToolbar
            variant="inline"
            data-testid={dataTestId}
            format={format || 'dd.MM.yyyy'}
            value={value}
            onChange={handleChange}
            disablePast={disablePast}
            autoOk={true}
            inputVariant="outlined"
            InputLabelProps={{
              shrink: false,
              error: error ? true : false,
            }}
            helperText={t('DATE_PICKER_DISABLE_ERROR_MSG')}
            onFocus={() => {
              setFocusOn(true)
            }}
            onBlur={() => {
              setFocusOn(false)
            }}
            keyboardIcon={<img src={calendar} alt="open calendar" />}
          />
        </MuiPickersUtilsProvider>
      </Container>
    )
  },
)`
  margin: 10px 0 0 0;
  label {
    color: #404042;
    display: block;
    font-size: 16px;
    font-weight: 400;
    padding-bottom: 2px;
    transition: none;
    transform: none;
  }
  .MuiFormControl-root {
    width: 100%;
  }
  .MuiOutlinedInput-adornedEnd {
    border: 1px solid ${props => (props.error ? '#db4437' : '#dddddd')};
    border-radius: 3px;
    padding-right: 0;
    background-color: white;
  }
  .MuiInputAdornment-positionEnd {
    margin-left: 0px;
  }
  .MuiIconButton-root {
    padding-left: 2px;
    :hover {
      background-color: initial;
    }
  }
  input {
    font-size: 16px;
    padding: 6px 6px;
    width: 100%;
    height: 21px;
  }
  fieldset {
    border: none;
  }
  .MuiFormHelperText-root.MuiFormHelperText-contained {
    display: none;

    &.Mui-error {
      display: block;
      margin: 8px 0 0;
      font-size: 14px;
      font-weight: 500;
      color: #db4437;
    }
  }
  .MuiTouchRipple-root {
    display: none;
  }
`

export default DatePicker
