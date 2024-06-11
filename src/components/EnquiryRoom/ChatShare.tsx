import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'

import { Chat } from '@cbreenterprise/spacespot-ui'

import Appointments, {
  NewAppointmentProps,
  EditAppointmentProps,
} from 'components/EnquiryRoom/Appointments/Appointments'

import Colors from 'assets/Colors'
import selectorsAppointments from 'services/appointment/selectors'
import selectorsChat from 'services/chat/selectors'
import appointmentActions from 'services/appointment/actions'
import chatActions from 'services/chat/actions'
import Documents from './Documents'
import selectors from 'services/enquiry/selectors'
import enquiryActions from 'services/enquiry/actions'
import eventActions from 'services/event/actions'
import { useWindowSize } from 'services/global/hooks'
import device from 'services/global/device'
import RichTextArea from 'components/common/RichTextArea'
import FilledButton from 'components/common/FilledButton'
import HTMLContent from 'components/common/HTMLContent'

const ContainerWrapper = styled.div`
  max-width: 1260px;
  margin: 0 auto;
`
const Container = styled.div`
  margin: 25px 20px 0px 20px;
  @media (max-width: 1024px) {
    margin: 25px 0px 0px 0px;
  }
`
const LeftColumn = styled.div`
  margin: 0 10px 0 0;
  width: 486px;
  float: left;
  display: flex;
  flex-direction: column;
  @media (max-width: 1024px) {
    display: none;
  }
`

const RightColumn = styled.div`
  margin: 0 0 0 20px;
  @media (max-width: 1024px) {
    margin-left: 0;
  }
  display: flex;
  flex-direction: column;
`

const Box = styled.div`
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid ${Colors.main.border}
  background-color: ${Colors.main.bg};
  min-height: 115px;
`

const StyledChat = styled(Chat)<{
  scrollTop: number
  windowHeight: string
}>`
  width: 100%;
  height: calc(${props => props.windowHeight} - 172px);
  @media ${device.mobile} {
    height: calc(${props => props.windowHeight} - 95px);
    border: none;
  }
  @media (max-width: 1024px) {
    border: none;
    border-bottom: 1px solid ${Colors.main.border};
  }

  border: 1px solid ${Colors.main.border}
  border-radius: 4px;
  opacity: 0.98;
  background-color: ${Colors.main.bg};
  display: flex;
  flex-direction: column;
  align-items: initial;
  justify-content: space-between;
  .sspot-chat-body {
    flex: 1 1 auto;
    height: unset;
    padding: 0 10px;
  }
  .sspot-chat-row svg {
    flex: 0 0 auto;
  }
  .sspot-chat-message p {
    word-break: break-word;
  }
  .sspot-chat-message div {
    word-break: break-word;
  }
`
const ICON_APPOINTMENTS = 'APPOINTMENTS'
const ICONS_DOCUMENTS = ['DOCUMENTS', 'TRASH']

const ChatInputContainer = styled.div`
  flex: 0 0 190px;
  border-top: 1px solid ${Colors.main.border};
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  .ql-container.ql-snow {
    border: none;
    border-right: 1px solid ${Colors.main.border};
    position: absolute;
    top: 40px;
    width: 80%;
    height: 78%;
  }
  .ql-toolbar.ql-snow {
    border: none;
    position: absolute;
  }
  .ql-editor {
    border-top: 1px solid ${Colors.main.border};
    min-height: 145px;
  }
  background: white;
`
const ChatTextArea = styled(RichTextArea)`
  box-sizing: border-box;
  margin: 0;
  padding: 0 12px 0 0;
  border: none;
  border-right: 1px solid ${Colors.main.border};
  outline: none;
  flex: 1 1 auto;
  width: 80%;
  height: 190px;
  overflow: auto;
`

const ChatActions = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 20%;
`

const ChatButton = styled(FilledButton)`
  background: ${Colors.main.headerBg};
  margin-bottom: 16px;
  @media ${device.mobile} {
    width: 100%;
  }
`

const ChatInput = (props: { onSubmit: (s: string) => void }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { onSubmit } = props
  const [value, setValue] = useState('')
  const handleChange = (val: string) => {
    setValue(val)
  }

  const onClick = () => {
    const trimmed = value.trim()
    if (onSubmit && trimmed !== '') {
      onSubmit(trimmed)
    }
    setValue('')
  }
  return (
    <ChatInputContainer>
      <ChatTextArea
        value={value}
        data-testid="chat-text"
        onChange={handleChange}
        rows={8}
      />
      <ChatActions>
        <ChatButton type="button" data-testid="chat-send" onClick={onClick}>
          {t('CHAT_SEND_CTA')}
        </ChatButton>
      </ChatActions>
    </ChatInputContainer>
  )
}

const ChatShare = (props: { scrollTop: number }) => {
  const appointments = useSelector(selectorsAppointments.appointmentsUser)
  const messages = useSelector(selectorsChat.getMessagesUser)
  const enquiryId = useSelector(selectors.getEnquiryId)
  const dispatch = useDispatch()
  const [follow, setFollow] = useState(true)
  const [numMessagesProcessed, setNumMessagesProcessed] = useState(0)
  const wBox = useWindowSize()
  const CONST_TTL = 20000

  useEffect(() => {
    if (enquiryId) {
      dispatch(chatActions.get())
      dispatch(eventActions.get(enquiryId.toString()))
    }
  }, [dispatch, enquiryId])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (enquiryId) {
        dispatch(chatActions.get())
        dispatch(eventActions.get(enquiryId.toString()))
      }
    }, CONST_TTL)
    return () => {
      clearTimeout(timeout)
    }
  })

  const bodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (follow && bodyRef && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, follow])

  useEffect(() => {
    if (enquiryId && messages.length > numMessagesProcessed) {
      const numMessagesUnprocessed = messages.length - numMessagesProcessed
      const messagesUnprocessed = messages.slice(-numMessagesUnprocessed)
      // Check for recent messages of appointments
      if (
        messagesUnprocessed.some(
          message =>
            message.isEvent &&
            !message.isOwn &&
            message.eventIcon === ICON_APPOINTMENTS &&
            moment(message.eventDate) > moment().subtract(2 * CONST_TTL, 'ms'),
        )
      ) {
        dispatch(appointmentActions.update())
      }
      // Check for recent messages of documents
      if (
        messages.some(
          message =>
            message.isEvent &&
            !message.isOwn &&
            ICONS_DOCUMENTS.includes(message.eventIcon as string) &&
            moment(message.eventDate) > moment().subtract(2 * CONST_TTL, 'ms'),
        )
      ) {
        dispatch(enquiryActions.updateDocs(enquiryId))
      }
      setNumMessagesProcessed(messages.length)
    }
  }, [dispatch, enquiryId, messages, numMessagesProcessed])

  const onBodyScroll = () => {
    if (bodyRef && bodyRef.current) {
      const maxTop = bodyRef.current.scrollHeight - bodyRef.current.offsetHeight
      const shouldFollow = bodyRef.current.scrollTop === maxTop
      setFollow(shouldFollow)
    }
  }

  const newAppointment = (payload: NewAppointmentProps) =>
    dispatch(
      appointmentActions.create({
        proposedTime: payload.date.toISOString(),
        description: payload.description,
      }),
    )
  const cancelAppointment = (id: string) =>
    dispatch(appointmentActions.cancel(id))
  const acceptAppointment = (id: string) =>
    dispatch(appointmentActions.accept(id))
  const newMessage = (payload: string) =>
    dispatch(chatActions.newMessage(payload))
  const proposedNewAppointment = (payload: EditAppointmentProps) =>
    dispatch(
      appointmentActions.change({
        id: payload.id,
        proposedTime: payload.date.toISOString(),
        description: payload.description,
      }),
    )

  return (
    <ContainerWrapper>
      <Container>
        <LeftColumn>
          <Box>
            <Appointments
              onProposedNew={proposedNewAppointment}
              onAccept={acceptAppointment}
              onCancel={cancelAppointment}
              onAdd={newAppointment}
              appointments={appointments}
            />
          </Box>
          <Box>
            <Documents />
          </Box>
        </LeftColumn>
        <RightColumn>
          <StyledChat
            scrollTop={props.scrollTop}
            windowHeight={wBox.height ? `${wBox.height}px` : '100vh'}
            messages={messages}
            bodyRef={bodyRef}
            onBodyScroll={onBodyScroll}
            onSubmit={newMessage}
            inputComp={<ChatInput onSubmit={newMessage} />}
            renderMsg={(msg: string) => <HTMLContent html={msg} />}
          />
        </RightColumn>
      </Container>
    </ContainerWrapper>
  )
}

export default ChatShare
