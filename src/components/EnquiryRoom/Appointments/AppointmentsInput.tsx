import React, { useState } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import { AppointmentProps, NewAppointmentProps } from './Appointments'
import AppointmentsButtons from './AppointmentsButtons'
import DatePicker from 'components/common/DatePicker'
import Input from 'components/common/Input'
import TimeInput from 'components/common/TimeInput'
import moment from 'moment'

const Container = styled.div`
  max-width: 510px;
  min-width: 360px;
  border-radius: 0 0 5px 5px;
  background-color: #f4f4f4;
  .MuiDialog-root .MuiToolbar-root.MuiPickersToolbar-toolbar,
  .MuiPickersClockNumber-clockNumber.MuiPickersClockNumber-clockNumberSelected {
    background-color: #6cb9d5;
  }
  .MuiDialogActions-root .MuiButton-label {
    color: #6cb9d5;
  }
`

const Title = styled.div`
  padding: 25px 10px 0 15px;
  width: 100%;
  color: #000;
  font-size: 20px;
  font-weight: 500;
  line-height: 25px;
`

const Inputs = styled.div`
  display: flex;
  flex: 1;
  padding: 10px 15px;
`

const InputDate = styled(DatePicker)`
  width: 135px;
  min-width: 135px;
`

const Time = styled.div`
  padding: 0 15px;
`

const Description = styled.div`
  flex-grow: 1;
  min-width: 90px;
  & > div {
    width: 100%;
  }
`

export interface AppointmentsInputProps {
  onAccept: (inputAppointment: NewAppointmentProps) => void
  onCancel: () => void
  appointment?: AppointmentProps
  noTitle?: boolean
  acceptLabel: string
  cancelLabel: string
}
const AppointmentsInput = (props: AppointmentsInputProps): JSX.Element => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const {
    onAccept,
    onCancel,
    appointment,
    noTitle,
    acceptLabel,
    cancelLabel,
  } = props
  const actualDate =
    appointment && appointment.date ? new Date(appointment.date) : new Date()
  const actualDescription = (appointment && appointment.description) || ''

  const [date, setDate] = useState(actualDate)
  const [lastValidDate, setLastValidDate] = useState(actualDate)

  const checkForValidDate = (dateToCheck: Date) => {
    return !isNaN(dateToCheck.getTime())
  }

  const handleDateChange = (datestr?: string | null) => {
    if (datestr) {
      const mm = lastValidDate ? lastValidDate.getMinutes() : 0
      const hh = lastValidDate ? lastValidDate.getHours() : 0
      datestr = moment(datestr, 'DD/MM/YYYY').format('MM/DD/YYYY') as string
      const newDate = new Date(datestr)
      newDate.setHours(Number(hh))
      newDate.setMinutes(Number(mm))
      if (checkForValidDate(newDate)) {
        setLastValidDate(newDate)
      }
      setDate(newDate)
    }
  }

  const handleTimeChange = (value: string) => {
    if (value) {
      const vals = value.split(':')
      const hh = vals[0]
      const mm = vals[1]
      const newDate = new Date(date)
      newDate.setHours(Number(hh))
      newDate.setMinutes(Number(mm))
      if (checkForValidDate(newDate)) {
        setLastValidDate(newDate)
      }
      setDate(newDate)
    }
  }

  const [description, setDescription] = useState(actualDescription)
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDescription(event.target.value)
  }
  const onAcceptAppointment = () => {
    if (checkForValidDate(date)) {
      onAccept({
        date,
        description,
      })
    }
  }

  return (
    <Container>
      {!noTitle ? <Title> {t('APPOINTMENTS_NEWTITLE')} </Title> : null}
      <Inputs>
        <InputDate
          id="appointment-intput-date"
          value={date}
          onChange={handleDateChange}
          label={t('APPOINTMENTS_DATE')}
          dataTestId="appointment-input-date"
          disablePast={true}
        />
        <Time>
          <TimeInput
            id="appointment-intput-time"
            label={t('APPOINTMENTS_TIME')}
            value={moment(lastValidDate).format('HH:mm')}
            onChange={handleTimeChange}
          />
        </Time>
        <Description>
          <Input
            id="appointment-input-desc"
            type="text"
            data-testid="appointment-input-description"
            label={t('APPOINTMENTS_DESCRIPTION')}
            value={description}
            onChange={handleDescriptionChange}
          />
        </Description>
      </Inputs>
      <AppointmentsButtons
        acceptLabel={acceptLabel}
        cancelLabel={cancelLabel}
        onCancel={onCancel}
        onAccept={onAcceptAppointment}
      />
    </Container>
  )
}

export default AppointmentsInput
