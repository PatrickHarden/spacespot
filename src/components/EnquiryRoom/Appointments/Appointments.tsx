import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import AppointmentsHeader from './AppointmentsHeader'
import AppointmentsTableHeader from './AppointmentsTableHeader'
import AppointmentsTableRow from './AppointmentsTableRow'
import AppointmentsInput from './AppointmentsInput'
import { isCancelledState, isOverdueState } from './utils'

const Root = styled.div`
  max-width: 510px;
  min-width: 360px;
`
const NoAppointments = styled.div`
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  padding: 0 0 10px 15px;
`

const Previous = styled.div`
  padding-top: 20px;
  color: #6cb9d5;
  font-size: 17px;
  font-weight: 500;
  line-height: 20px;
  float: right;
  text-decoration: underline;
  cursor: pointer;
`

const AppointmentsTable = styled.div``

export interface AppointmentProps {
  id: string
  date: Date
  description: string
  appointmentStatus: string
  isOwnLast: boolean
}
export interface NewAppointmentProps {
  date: Date
  description: string
}
export interface EditAppointmentProps {
  id: string
  date: Date
  description: string
}

export interface AppointmentsProps {
  appointments: Array<AppointmentProps>
  onAdd: (newAppointment: NewAppointmentProps) => void
  onProposedNew: (editAppointment: EditAppointmentProps) => void
  onAccept: (id: string) => void
  onCancel: (id: string) => void
}

const Appointments = (props: AppointmentsProps) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  const { appointments, onAdd, onProposedNew, onAccept, onCancel } = props
  const [isShowingAddAppointment, showAddAppointment] = useState(false)
  const [isShowingOld, showOld] = useState(false)

  const orderedAppointments = appointments
    .filter(
      (appointment: AppointmentProps) =>
        !isCancelledState(appointment) && !isOverdueState(appointment),
    )
    .sort((appointment1: AppointmentProps, appointment2: AppointmentProps) => {
      const dateNow = new Date().getTime()
      if (appointment1.date.getTime() < dateNow) {
        return appointment2.date.getTime() < dateNow
          ? appointment1.date.getTime() - appointment2.date.getTime()
          : 1
      }
      if (appointment2.date.getTime() < dateNow) {
        return -1
      }
      return appointment1.date.getTime() - appointment2.date.getTime()
    })
  const existsOld = orderedAppointments.some(
    (appointment: AppointmentProps) => appointment.date < new Date(),
  )
  return (
    <Root>
      <AppointmentsHeader showAddAppointment={showAddAppointment} />
      {orderedAppointments.length > 0 ? (
        <AppointmentsTable>
          <AppointmentsTableHeader />

          {orderedAppointments.map(appointment => (
            <AppointmentsTableRow
              showingOld={isShowingOld}
              onProposedNew={onProposedNew}
              onCancel={onCancel}
              onAccept={onAccept}
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </AppointmentsTable>
      ) : (
        <NoAppointments>{t('APPOINTMENTS_NOAPPOINTMENTS')}</NoAppointments>
      )}
      {isShowingAddAppointment ? (
        <AppointmentsInput
          noTitle={true}
          onAccept={(newAppointment: NewAppointmentProps) => {
            onAdd(newAppointment)
            showAddAppointment(false)
          }}
          onCancel={() => showAddAppointment(false)}
          acceptLabel={t('APPOINTMENTS_NEWOK')}
          cancelLabel={t('APPOINTMENTS_NEWKO')}
        />
      ) : null}
      {existsOld && !isShowingOld ? (
        <Previous
          data-testid="appointment-show-previous"
          onClick={() => showOld(true)}>
          {t('APPOINTMENTS_PREVIOUS')}
        </Previous>
      ) : null}
    </Root>
  )
}

export default Appointments
