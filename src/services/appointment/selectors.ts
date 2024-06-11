import { get } from 'lodash'
import moment from 'moment'
import { SpacespotState } from '../global/types'
import { Appointment } from './types'
import { AppointmentProps } from '@cbreenterprise/spacespot-ui'

import userSelectors from '../user/selectors'

const appointment = (state: SpacespotState) => get(state, 'appointment.data')
const appointmentsUser = (state: SpacespotState) => {
  const appointments = appointment(state)
  const userId = userSelectors.accountIdentifier(state)
  return appointments
    ? appointments.map(
        (appoint: Appointment): AppointmentProps => ({
          id: appoint.id.toString(),
          date: moment(appoint.proposedTime).toDate(),
          description: appoint.description,
          appointmentStatus: appoint.appointmentStatus,
          isOwnLast: userId === appoint.lastProposedBy,
        }),
      )
    : []
}
const error = (state: SpacespotState) => get(state, 'appointment.error')

export default {
  appointment,
  appointmentsUser,
  error,
}
