import { AppointmentProps } from './Appointments'

export const isOverdueState = (appointment: AppointmentProps) =>
  appointment.appointmentStatus && appointment.appointmentStatus === 'OVERDUE'

export const isCancelledState = (appointment: AppointmentProps) =>
  appointment.appointmentStatus && appointment.appointmentStatus === 'CANCELLED'

export const isAcceptedState = (appointment: AppointmentProps) =>
  appointment.appointmentStatus && appointment.appointmentStatus === 'ACCEPTED'

export const isProposedState = (appointment: AppointmentProps) =>
  appointment.appointmentStatus && appointment.appointmentStatus === 'PROPOSED'
