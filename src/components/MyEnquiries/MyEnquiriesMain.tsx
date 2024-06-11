import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { get } from 'lodash'
import moment from 'moment'
import styled from 'styled-components'
import device from 'services/global/device'

import { MyEnquiriesAPIResponse } from 'services/myEnquiries/types'
import { useMyEnquiries } from 'services/myEnquiries/hooks'
import { ChatMessage } from 'services/chat/types'
import { TermStatus } from 'services/negotiation/types'
import selectorsUser from 'services/user/selectors'

import Heading1 from 'components/common/Heading1'
import Heading2 from 'components/common/Heading2'
import Enquiry from './Enquiry'

const Container = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  min-width: 120px;
  min-height: 320px;
  padding: 0px 20px;
`
const ContainerEnquiries = styled.div`
  padding-bottom: 60px;
  @media ${device.mobile} {
    padding-bottom: 20px;
  }
`

const Line = styled.div`
  border-bottom: 1px solid #979797;
  position: relative;
  margin: 40px 0;
`
const CountEnquiries = styled.h4`
  line-height: 1.5em;
  color: black;
  font-size: 16px;
  background-color: white;
  color: #000000;
  font-weight: 300;
  position: absolute;
  left: 20px;
  top: -12px;
  margin: 0;
  padding: 0 25px;
`
const getLastMessageDate = (messages: Array<ChatMessage>) =>
  get(
    messages &&
      messages.reduce((lastMessage: ChatMessage, message: ChatMessage) =>
        !lastMessage ||
        moment(message.sentAt).toDate() < moment(lastMessage.sentAt).toDate()
          ? lastMessage
          : message,
      ),
    'sentAt',
  )

const getPeerMessages = (messages: Array<ChatMessage>, userId: string) => {
  return messages && messages.filter(message => message.userId !== userId)
}

const getUnreadMessages = (
  lastRead: Date,
  messages: Array<ChatMessage>,
  userId: string,
) => {
  return (
    messages &&
    messages
      .filter(message => message.userId !== userId)
      .filter(
        message => !lastRead || lastRead < moment(message.sentAt).toDate(),
      )
  )
}

type EnquiryData = MyEnquiriesAPIResponse & {
  unreadMessages: number
  lastActivity: Date
  attention: boolean
}

const mapToEnquiryData = (
  enquiry: MyEnquiriesAPIResponse,
  isLandlord: boolean,
): EnquiryData => {
  const userId = isLandlord ? enquiry.peer2Id : enquiry.peer1Id
  const peerMessages = getPeerMessages(enquiry.messages, userId)
  const lastRead = isLandlord
    ? enquiry.lastReadByLandlord
    : enquiry.lastReadByTenant
  const lastReadDate = lastRead ? moment(lastRead).toDate() : null
  const unread = lastReadDate
    ? getUnreadMessages(lastReadDate, enquiry.messages, userId)
    : peerMessages
  const lastMessageDate = moment(getLastMessageDate(enquiry.messages)).toDate()
  const lastEvent = enquiry.lastActivityDetails
    ? moment(enquiry.lastActivityDetails.eventDate).toDate()
    : null
  const lastActivity = lastEvent
    ? lastMessageDate > lastEvent
      ? lastMessageDate
      : lastEvent
    : lastMessageDate

  // const unreadEvents =
  //   lastEvent !== null && lastReadDate != null && lastEvent > lastReadDate
  const attention = !!enquiry.eventNotification || unread.length > 0
  const unreadLen =
    attention && lastEvent && lastMessageDate < lastEvent ? 0 : unread.length
  return {
    ...enquiry,
    unreadMessages: unreadLen,
    lastActivity: lastActivity,
    attention,
  }
}

const getUnaccepted = (enquiries: Array<MyEnquiriesAPIResponse>) =>
  enquiries.filter(enquiry => enquiry.enquireStatus === TermStatus.Pending)

const getClosed = (enquiries: Array<MyEnquiriesAPIResponse>) =>
  enquiries.filter(
    e =>
      e.enquireStatus !== TermStatus.Pending &&
      e.enquireStatus !== TermStatus.Accepted &&
      e.enquireStatus !== TermStatus.Declined,
  )

const getLandlordOthers = (enquiries: Array<MyEnquiriesAPIResponse>) =>
  enquiries.filter(e => e.enquireStatus === TermStatus.Accepted)

const getTenantOthers = (enquiries: Array<MyEnquiriesAPIResponse>) =>
  enquiries.filter(
    e =>
      e.enquireStatus === TermStatus.Accepted ||
      e.enquireStatus === TermStatus.Declined ||
      e.enquireStatus === TermStatus.Pending,
  )

const getAttention = (
  enquiries: Array<MyEnquiriesAPIResponse>,
  isLandlord: boolean,
): Array<EnquiryData> =>
  enquiries
    .map(enquiry => mapToEnquiryData(enquiry, isLandlord))
    .filter(e => e.attention && e.enquireStatus !== TermStatus.Pending)

const getOthers = (
  enquiries: Array<MyEnquiriesAPIResponse>,
  isLandlord: boolean,
): Array<EnquiryData> =>
  enquiries
    .map(enquiry => mapToEnquiryData(enquiry, isLandlord))
    .filter(
      e => e.attention === false || e.enquireStatus === TermStatus.Pending,
    )

const MyEnquiriesMain = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const tn = (s: string, value: number) =>
    formatMessage({ id: s }, { number: value })
  const isLandlord = useSelector(selectorsUser.isLandlord)

  const unsorted = useMyEnquiries()
  const enquiries = (unsorted || []).sort((a, b) =>
    a.enquireId < b.enquireId ? 1 : -1,
  )
  const unaccepted = getUnaccepted(enquiries)
  const closed = getClosed(enquiries)
  const rest = isLandlord
    ? getLandlordOthers(enquiries)
    : getTenantOthers(enquiries)
  const attention = getAttention(rest, isLandlord).sort((a, b) =>
    a.lastActivity < b.lastActivity ? 1 : -1,
  )
  const others = getOthers(rest, isLandlord).sort((a, b) =>
    a.lastActivity < b.lastActivity ? 1 : -1,
  )

  const total = isLandlord
    ? unaccepted.length + closed.length + rest.length
    : enquiries.length

  return (
    <Container>
      <Heading1>{t('YOUR_ENQUIRIES_TITLE')}</Heading1>
      <Line>
        <CountEnquiries>
          {tn('YOUR_ENQUIRIES_COUNT', total).toUpperCase()}
        </CountEnquiries>
      </Line>
      {isLandlord && unaccepted.length > 0 ? (
        <ContainerEnquiries>
          <Heading2>{t('YOUR_ENQUIRIES_NEW')}</Heading2>
          {unaccepted.map(enquiry => (
            <Enquiry
              key={enquiry.enquireId}
              enquiry={enquiry}
              isPending={true}
              isLandlord={isLandlord}
              isUnaccepted={true}
              hasNotifications={enquiry.eventNotification}
            />
          ))}
        </ContainerEnquiries>
      ) : null}
      {attention.length > 0 ? (
        <ContainerEnquiries>
          <Heading2>{t('YOUR_ENQUIRIES_ATTENTION')}</Heading2>
          {attention.map(enquiry => (
            <Enquiry
              key={enquiry.enquireId}
              enquiry={enquiry}
              isUnattended={true}
              unreadMessages={enquiry.unreadMessages}
              isLandlord={isLandlord}
              sinceWhen={enquiry.lastActivity.toString()}
              hasNotifications={enquiry.eventNotification}
            />
          ))}
        </ContainerEnquiries>
      ) : null}
      {others.length > 0 ? (
        <ContainerEnquiries>
          <Heading2>{t('YOUR_ENQUIRIES_OTHER')}</Heading2>
          {others.map(enquiry => (
            <Enquiry
              key={enquiry.enquireId}
              enquiry={enquiry}
              isLandlord={isLandlord}
              sinceWhen={enquiry.lastActivity.toString()}
              isUnaccepted={enquiry.enquireStatus === TermStatus.Pending}
              hasNotifications={enquiry.eventNotification}
            />
          ))}
        </ContainerEnquiries>
      ) : null}
      {closed.length > 0 ? (
        <ContainerEnquiries>
          <Heading2>{t('YOUR_ENQUIRIES_CLOSED')}</Heading2>
          {closed.map(enquiry => (
            <Enquiry
              key={enquiry.enquireId}
              enquiry={enquiry}
              isLandlord={isLandlord}
              isClosed={true}
            />
          ))}
        </ContainerEnquiries>
      ) : null}
    </Container>
  )
}

export default MyEnquiriesMain
