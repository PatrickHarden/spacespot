import { get } from 'lodash'
import moment from 'moment'
import { SpacespotState } from '../global/types'
import { EnquiryEvent } from './types'
import { ChatEventProps } from '@cbreenterprise/spacespot-ui'
import { getUserIntl } from 'intl'

const showDateEvent = (event: EnquiryEvent) =>
  moment(get(event, 'eventMessage.appointmentDate', null)).format(
    'DD.MM.YYYY - hh:mm:ss A',
  )

const showDocumentNameEvent = (event: EnquiryEvent) =>
  get(event, 'eventMessage.fileName', '')

const useEventTypeTranslate = (event: EnquiryEvent) => {
  const intl = getUserIntl()
  switch (event.eventType) {
    case 'NEW_APPOINTMENT': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({ id: 'EVENT_NEW_APPOINTMENT_TITLE' }),
        eventText: showDateEvent(event),
        eventIcon: 'APPOINTMENTS',
        eventIsFilled: false,
      }
    }
    case 'MODIFIED_APPOINTMENT': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({
          id: 'EVENT_MODIFIED_APPOINTMENT_TITLE',
        }),
        eventText: showDateEvent(event),
        eventIcon: 'APPOINTMENTS',
        eventIsFilled: false,
      }
    }
    case 'ACCEPT_APPOINTMENT': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({
          id: 'EVENT_ACCEPT_APPOINTMENT_TITLE',
        }),
        eventText: showDateEvent(event),
        eventIcon: 'APPOINTMENTS',
        eventIsFilled: false,
      }
    }
    case 'CANCEL_APPOINTMENT': {
      return {
        eventType: 'CANCEL',
        eventTitle: intl.formatMessage({
          id: 'EVENT_CANCEL_APPOINTMENT_TITLE',
        }),
        eventText: showDateEvent(event),
        eventIcon: 'APPOINTMENTS',
        eventIsFilled: false,
        isTextLinedThrough: false,
      }
    }
    case 'DOCUMENT_UPLOAD': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({ id: 'EVENT_DOCUMENT_UPLOAD_TITLE' }),
        eventText: showDocumentNameEvent(event),
        eventIcon: 'DOCUMENTS',
        eventIsFilled: false,
      }
    }
    case 'DOCUMENT_DELETE': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({ id: 'EVENT_DOCUMENT_DELETE_TITLE' }),
        eventText: showDocumentNameEvent(event),
        eventIcon: 'TRASH',
        eventIsFilled: false,
      }
    }
    case 'COUNTER_NEGOTIATION': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({
          id: 'EVENT_COUNTER_NEGOTIATION_TITLE',
        }),
        eventText: intl.formatMessage({
          id: 'EVENT_COUNTER_NEGOTIATION_TEXT',
        }),
        eventIcon: 'TERMS',
        eventIsFilled: true,
      }
    }
    case 'ACCEPT_NEGOTIATION': {
      return {
        eventType: 'ACCEPT',
        eventTitle: intl.formatMessage({
          id: 'EVENT_ACCEPT_NEGOTIATION_TITLE',
        }),
        eventText: '',
        eventIcon: 'TICK',
        eventIsFilled: true,
      }
    }
    case 'REJECT_NEGOTIATION': {
      return {
        eventType: 'CANCEL',
        eventTitle: intl.formatMessage({
          id: 'EVENT_REJECT_NEGOTIATION_TITLE',
        }),
        eventText: intl.formatMessage({ id: 'EVENT_REJECT_NEGOTIATION_TEXT' }),
        eventIcon: 'CROSS',
        eventIsFilled: true,
      }
    }
    case 'SPECIAL_PROVISION_NEGOTIATION': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({
          id: 'EVENT_SPECIAL_PROVISION_NEGOTIATION_TITLE',
        }),
        eventText: intl.formatMessage({
          id: 'EVENT_SPECIAL_PROVISION_NEGOTIATION_TEXT',
        }),
        eventIcon: 'TERMS',
        eventIsFilled: true,
      }
    }
    case 'ACCEPT_SPECIAL_PROVISION': {
      return {
        eventType: 'ACCEPT',
        eventTitle: intl.formatMessage({
          id: 'EVENT_ACCEPT_SPECIAL_PROVISION_TITLE',
        }),
        eventText: '',
        eventIcon: 'TICK',
        eventIsFilled: true,
      }
    }
    case 'REJECT_SPECIAL_PROVISION': {
      return {
        eventType: 'CANCEL',
        eventTitle: intl.formatMessage({
          id: 'EVENT_CANCEL_SPECIAL_PROVISION_TITLE',
        }),
        eventText: intl.formatMessage({
          id: 'EVENT_CANCEL_SPECIAL_PROVISION_TEXT',
        }),
        eventIcon: 'CROSS',
        eventIsFilled: true,
      }
    }
    case 'LEASE_SIGNED': {
      return {
        eventType: 'ACCEPT',
        eventTitle: intl.formatMessage({
          id: 'EVENT_LEASE_SIGNED_TITLE',
        }),
        eventText: '',
        eventIcon: 'TERMS',
        eventIsFilled: true,
      }
    }
    case 'ACCEPT_LEASE': {
      return {
        eventType: 'ACCEPT',
        eventTitle: intl.formatMessage({
          id: 'EVENT_ACCEPT_LEASE_TITLE',
        }),
        eventText: '',
        eventIcon: 'TERMS',
        eventIsFilled: true,
      }
    }
    case 'ADD_CUSTOM_FITOUT': {
      return {
        eventType: 'STANDARD',
        eventTitle: intl.formatMessage({
          id: 'EVENT_ADD_CUSTOM_FITOUT_TITLE',
        }),
        eventText: '',
        eventIcon: 'TERMS',
        eventIsFilled: true,
      }
    }
    case 'SELECT_CUSTOM_FITOUT': {
      return {
        eventType: 'ACCEPT',
        eventTitle: intl.formatMessage({
          id: 'EVENT_SELECT_CUSTOM_FITOUT_TITLE',
        }),
        eventText: '',
        eventIcon: 'TICK',
        eventIsFilled: true,
      }
    }
    default: {
      return {
        eventType: 'STANDARD',
        eventTitle: '',
        eventText: '',
        eventIcon: '',
        eventIsFilled: false,
      }
    }
  }
}
const getEvents = (id: number) => (
  state: SpacespotState,
): Array<ChatEventProps & EnquiryEvent> =>
  get(get(get(state, 'event'), id), 'events', []).map(
    (event: EnquiryEvent) => ({
      isEvent: true,
      ...event,
      ...useEventTypeTranslate(event),
    }),
  )

export default {
  getEvents,
}
