export interface AppointmentState {
  data?: Array<Appointment>
  error?: string
}

export interface Appointment {
  id: number
  enquireId: number
  description: string
  peer1Id: string
  peer2Id: string
  proposedTime: string
  createdAt: string
  lastUpdatedAt: string
  lastProposedBy: string
  appointmentStatus: string
}

export interface NewAppointment {
  description: string
  proposedTime: string
}
export interface EditAppointment {
  id: string
  description: string
  proposedTime: string
}
export interface AppointmentAction {
  type: string
  payload?: Array<Appointment> | NewAppointment | EditAppointment | string
}
