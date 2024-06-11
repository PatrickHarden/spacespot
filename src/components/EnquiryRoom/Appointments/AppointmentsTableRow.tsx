import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import moment from 'moment'

import spaceSelectors from 'services/space/selectors'

import {
  AppointmentProps,
  NewAppointmentProps,
  EditAppointmentProps,
} from './Appointments'
import AppointmentsInput from './AppointmentsInput'
import AppointmentsButtons from './AppointmentsButtons'
import {
  isOverdueState,
  isCancelledState,
  isAcceptedState,
  isProposedState,
} from './utils'
import dots from 'assets/icons/dots.svg'
import share from 'assets/icons/appointment.svg'
import { getStreet, getTitle } from 'services/space/helpers'

const Row = styled.div<{ isAccepted: boolean | '' }>`
  color: ${props => (props.isAccepted ? '#404042' : 'rgba(64, 64, 66, 0.6)')};
  font-size: 16px;
  font-weight: 400;
  letter-spacing: NaNpx;
  line-height: 16px;
  padding: 0 5px;
  display: flex;
  flex-direction: row;
`

const Container = styled.div`
  border-bottom: 1px solid rgba(64, 64, 66, 0.44);
  :last-child {
    border-bottom: none;
  }
`

const DateText = styled.div`
  padding: 10px;
  width: 70px;
`
const TimeText = styled.div`
  padding: 10px;
  width: 70px;
`

const Description = styled.div`
  padding: 10px;
  width: 70px;
  flex-grow: 1;
  min-width: 90px;
  & > div {
    width: 100%;
  }
`

const Icon = styled.div`
  cursor: pointer;
  padding: 5px 15px;
  margin: 7px 0;
  line-height: 10px;
`

const Waiting = styled.div`
  padding-left: 194px;
  padding-bottom: 10px;
  color: #ebbf59;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
`

export interface AppointmentsTableRowProps {
  appointment: AppointmentProps
  onProposedNew: (newTime: EditAppointmentProps) => void
  onAccept: (id: string) => void
  onCancel: (id: string) => void
  showingOld?: boolean
}
const AppointmentsTableRow = (
  props: AppointmentsTableRowProps,
): JSX.Element => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const space = useSelector(spaceSelectors.selectedSpace)
  const parent = useSelector(spaceSelectors.parentSpace)
  const { appointment, onProposedNew, onAccept, onCancel, showingOld } = props
  const [isShowingRow, showRow] = useState(false)
  const showIcon: boolean = appointment.date > new Date()

  if (
    isCancelledState(appointment) ||
    isOverdueState(appointment) ||
    (isAcceptedState(appointment) && !showIcon && !showingOld)
  ) {
    return <></>
  }
  const date = moment(appointment.date).format('Do MMM')
  const time = moment(appointment.date).format('H:mm')

  const onClickRow = () => showRow(!isShowingRow)
  const additionalRow = () => {
    if (isShowingRow) {
      return (
        <AppointmentsInput
          onAccept={(NewAppointment: NewAppointmentProps) => {
            showRow(false)
            return onProposedNew({ ...NewAppointment, id: appointment.id })
          }}
          onCancel={() => {
            showRow(false)
            return onCancel(appointment.id)
          }}
          appointment={appointment}
          acceptLabel={t('APPOINTMENTS_SAVE')}
          cancelLabel={t('APPOINTMENTS_CANCEL')}
        />
      )
    }
    if (!appointment.isOwnLast && isProposedState(appointment)) {
      return (
        <AppointmentsButtons
          onAccept={() => onAccept(appointment.id)}
          onCancel={onClickRow}
          acceptLabel={t('APPOINTMENTS_ACCEPT')}
          cancelLabel={t('APPOINTMENTS_DECLINE')}
        />
      )
    }

    if (isProposedState(appointment)) {
      return <Waiting> {t('APPOINTMENTS_WAITING')} </Waiting>
    }
  }

  const downloadFile = (blob: Blob, fileName: string) => {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // IE fallback
      window.navigator.msSaveOrOpenBlob(blob)
      return
    }
    const objectUrl = URL.createObjectURL(blob)
    const el = document.createElement('a')
    el.setAttribute('href', objectUrl)
    el.setAttribute('download', fileName)
    el.style.display = 'none'
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }

  const statusMap: { [key: string]: string } = {
    CANCELLED: 'CANCELLED',
    ACCEPTED: 'CONFIRMED',
    PROPOSED: 'TENTATIVE',
  }

  const onClickShare = () => {
    const tzdate = moment(appointment.date).format('YYYYMMDDTHHmmss')
    const tzend = moment(appointment.date)
      .add(30, 'minutes')
      .format('YYYYMMDDTHHmmss')
    const tzname = Intl.DateTimeFormat().resolvedOptions().timeZone
    const status = statusMap[appointment.appointmentStatus] || 'TENTATIVE'
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Viewing of ${getTitle(space)}
DTSTART;TZID=${tzname}:${tzdate}
DTEND;TZID=${tzname}:${tzend}
LOCATION:${getStreet(parent)}
DESCRIPTION:${appointment.description}
STATUS: ${status}
END:VEVENT
END:VCALENDAR
`
    const data = [ics]
    const blob = new Blob(data, { type: 'text/calendar' })
    downloadFile(blob, `${tzdate}.ics`)
  }

  return (
    <Container>
      <Row isAccepted={isAcceptedState(appointment)}>
        <DateText> {date} </DateText>
        <TimeText> {time} </TimeText>
        <Description> {appointment.description} </Description>
        {showIcon ? (
          <>
            <Icon onClick={onClickShare} title={t('APPOINTMENTS_ICS_TOOLTIP')}>
              <img src={share} alt="Share" />
            </Icon>
            <Icon onClick={onClickRow}>
              <img src={dots} alt="More" />
            </Icon>
          </>
        ) : null}
      </Row>
      {additionalRow()}
    </Container>
  )
}

export default AppointmentsTableRow
