import React, { useState } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import history from 'browserhistory'

import { MyEnquiriesAPIResponse, EventType } from 'services/myEnquiries/types'
import selectorsSpace from 'services/space/selectors'
import { getPhoto, getStreet, getTitle } from 'services/space/helpers'
import actionsMyEnquiries from 'services/myEnquiries/actions'
import actions from 'services/enquiry/actions'
import { EnquiryType } from 'services/enquiry/types'
import { getFields } from 'services/negotiation/helpers'
import { useNegotiationFields } from 'services/negotiation/hooks'
import {
  showAvailabilityDate,
  showAvailabilityDatePast,
} from 'services/onboarding/utils'
import { TermStatus } from 'services/negotiation/types'
import OutlinedButton from 'components/common/OutlinedButton'
import FilledButton from 'components/common/FilledButton'
import Avatar from 'components/Avatar/Avatar'
import FixedSpaceDetail from './FixedSpaceDetail'
import FlexSpaceDetail from './FlexSpaceDetail'
import Data from './Data'
import { get } from 'lodash'
import { useProfile } from 'services/user/hooks'

import defaultImg from 'assets/img/building.svg'
import device from 'services/global/device'
import FeedbackDialog from './FeedbackDialog'

const ActivityText = styled.div`
  padding: 30px 10px;
  text-align: center;
  @media ${device.lessThanIPad} {
    padding: 0;
    margin: 0 auto;
  }
`

const Container = styled.div<{
  isPending?: boolean
  isUnattended?: boolean
  notClickable?: boolean
}>`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  background-color: ${props => (props.isUnattended ? '#F4F4F4' : '#FFFFFF')};
  box-shadow: 0px 1px 5px 2px rgba(64,64,66,0.2);
  border-radius: 2px;
  margin-bottom: 20px;
  cursor: ${props => (props.notClickable ? 'unset' : 'pointer')};
  position: relative;
  z-index: 0;
  ${props =>
    !props.notClickable &&
    `
  :hover {
    box-shadow: 0px 1px 12px 2px rgba(64,64,66,0.4);
  }
  `}
  @media ${device.lessThanIPad} {
    flex-direction: column;
  }
`
// First column: avatar/photo
const AvatarConatiner = styled.div<{ isPending?: boolean }>`
  flex: 0 0 auto;
  width: 175px;
  ${ActivityText} {
    display: none;
  }
  @media ${device.lessThanIPad} {
    width: 100%;
    height: 100px;
    display: ${props => (props.isPending ? 'none' : 'flex')};
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    ${ActivityText} {
      padding: 20px;
      display: block;
    }
  }

  @media ${device.mobile} {
    ${ActivityText} {
      padding: 10px 0;
    }
  }
`

// Second column: building data
const ContainerMain = styled.div`
  flex: 0 0 auto;
  width: 30%;
  min-width: 270px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e7e7e7;
  padding: 0 10px;
  margin: 10px 0;
  @media ${device.lessThanIPad} {
    margin: 0;
    padding: 15px 10px;
    box-sizing: border-box;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e7e7e7;
  }
`

// 3th column: lease request
const ContainerLease = styled.div`
  flex: 1 1 auto;
  width: 25%;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  margin: 10px 0;
  border-right: 1px solid #e7e7e7;
  @media ${device.lessThanIPad} {
    margin: 0;
    padding: 15px 10px;
    width: calc(100% - 20px);
    border: none;
  }
`

// 4th column: activity
const ContainerActivity = styled.div`
  flex: 0 1 auto;
  width: 24%;
  min-width: 80px;
  margin: 10px 0;
  @media ${device.lessThanIPad} {
    width: 100%;
    margin: 0;
    ${ActivityText} {
      display: none;
    }
  }
`

const InfoContainer = styled.div`
  display: flex;
  width: 100%;
`

const AvatarWithName = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 10px;
  align-items: center;
  text-align: center;
  div {
    flex: 0 0 auto;
  }
`

const Photo = styled.div`
  height: 100%;
  img {
    width: 175px;
    height: 100%;
    object-fit: cover;
    @media ${device.lessThanIPad} {
      padding: 10px;
      width: 150px;
      height: 80px;
    }
  }
`

const Headline = styled.div`
  color: #000000;
  font-size:18px;
  font-weight:400
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const Street = styled.div`
  color: #828286;
  font-size: 16px;
  font-weight: 400;
  padding-bottom: 10px;
`

const LeaseTitle = styled.div`
  width: 100%;
  color: #000000;
  font-size: 18px;
  font-weight: 400;
  padding-bottom: 33px;
  @media ${device.lessThanIPad} {
    padding-bottom: 10px;
  }
`

const ButtonsContainer = styled.div`
  padding-top: 60px;
  margin: 5px;
  display: flex;
  justify-content: space-around;
  @media ${device.lessThanIPad} {
    box-sizing: border-box;
    border-top: 1px solid #e7e7e7;
    width: 100%;
    padding: 10px 0;
    margin: 0;
  }
`

const ButtonDecline = styled(OutlinedButton)`
  color: #6cb9d5;
  box-sizing: border-box;
  border: none;
  padding: 0 10px;
`
const ButtonAccept = styled(FilledButton)`
  color: #fffff0;
  margin-left: 10px;
  padding: 0 10px;
`

const TextUnread = styled.div`
  color: #ff4e02;
  font-size: 16px;
  font-weight: 500;
`
const TextWhen = styled.div`
  color: #828286;
  font-size: 16px;
  font-weight: 400;
  width: 100%;
  @media ${device.mobile} {
    font-size: 15px;
  }
`

const LastActivity = styled.div<{ attention?: boolean }>`
  color: ${props => (props.attention ? '#ff4e02;' : '#828286')};
  font-size: 16px;
  font-weight: 400;
  width: 100%;
  @media ${device.mobile} {
    font-size: 15px;
    margin-top: 10px;
  }
`
const TextPending = styled.div`
  widht: 100%;
  color: #ebbf59;
  font-weight: 400;
  @media ${device.mobile} {
    font-size: 15px;
    margin-top: 10px;
  }
`

const TextDeclined = styled.div`
  widht: 100%;
  color: #db4437;
  font-weight: 400;
  @media ${device.mobile} {
    font-size: 15px;
    margin-top: 10px;
  }
`
const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 10px;
  cursor: pointer;
  border: none;
  z-index: 10;
  background-color: transparent;
  outline: none;
`

const RedSpot = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background-color: #db4437;
  border-radius: 50%;
  z-index: 10;
`

const DisplayName = styled((props: { className?: string; userId: string }) => {
  const profile = useProfile(props.userId)
  const displayName = profile ? profile.displayName : ''
  return <div className={props.className}>{displayName}</div>
})`
  margin-top: 3px;
`

const ShowUnreadAndTime = (props: {
  isPending?: boolean
  isUnattended?: boolean
  unreadMessages?: number
  sinceWhen?: string
  isLandlord?: boolean
  eventType?: EventType
}) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const {
    isPending,
    isUnattended,
    unreadMessages,
    sinceWhen,
    isLandlord,
    eventType,
  } = props

  if (isUnattended) {
    return (
      <ActivityText>
        {unreadMessages ? (
          <TextUnread>
            {formatMessage(
              { id: 'YOUR_ENQUIRES_UNREAD_MESSAGES' },
              { number: unreadMessages },
            )}
          </TextUnread>
        ) : (
          <LastActivity attention={true}>
            {eventType
              ? t(`EVENT_${eventType}_TITLE`)
              : formatMessage({ id: 'YOUR_ENQUIRES_ACCEPTED' })}
          </LastActivity>
        )}
        <TextWhen>
          {showAvailabilityDatePast(
            sinceWhen ? new Date(sinceWhen) : new Date(),
            t('ONBOARDING_AVAILABILITY_NOW'),
          )}
        </TextWhen>
      </ActivityText>
    )
  } else if (!isPending && !isUnattended) {
    return (
      <ActivityText>
        <LastActivity>
          {eventType
            ? t(`EVENT_${eventType}_TITLE`)
            : formatMessage({ id: 'YOUR_ENQUIRES_NO_ACTIVITY_SINCE' })}
        </LastActivity>
        <TextWhen>
          {showAvailabilityDatePast(
            sinceWhen ? new Date(sinceWhen) : new Date(),
            t('ONBOARDING_AVAILABILITY_NOW'),
          )}
        </TextWhen>
      </ActivityText>
    )
  } else if (isPending && !isLandlord) {
    return (
      <ActivityText>
        <TextPending>
          {formatMessage({ id: 'YOUR_ENQUIRES_PENDING' })}
        </TextPending>
        <TextWhen>
          {showAvailabilityDatePast(
            sinceWhen ? new Date(sinceWhen) : new Date(),
            t('ONBOARDING_AVAILABILITY_NOW'),
          )}
        </TextWhen>
      </ActivityText>
    )
  }
  return null
}

const Enquiry = (props: {
  enquiry: MyEnquiriesAPIResponse
  isPending?: boolean
  isUnattended?: boolean
  isUnaccepted?: boolean
  unreadMessages?: number
  sinceWhen?: string
  isLandlord?: boolean
  isClosed?: boolean
  hasNotifications?: boolean
}) => {
  const {
    enquiry,
    isPending,
    isUnattended,
    isUnaccepted,
    unreadMessages,
    sinceWhen,
    isLandlord,
    isClosed,
    hasNotifications,
  } = props
  const glSpace = useSelector(selectorsSpace.selectSpace(enquiry.spaceId))
  const terms = useNegotiationFields()
  const [cancelPopup, setCancelPopup] = useState(false)

  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const fieldsValues = getFields(terms, enquiry.terms)
  const street = getStreet(glSpace)
  const title = getTitle(glSpace)
  const photo = getPhoto(glSpace) || defaultImg
  const tenantId = get(enquiry, 'peer1Id', '')
  const landlordId = get(enquiry, 'peer2Id', '')
  const peerId = isLandlord ? tenantId : landlordId

  const cancelEnquiry = (reason?: string) => {
    setCancelPopup(false)
    dispatch(
      actionsMyEnquiries.cancel({
        enquiryId: enquiry.enquireId.toString(),
        feedback: reason,
      }),
    )
  }

  const formatDate = (date: Date) =>
    showAvailabilityDate(date, t('ONBOARDING_AVAILABILITY_NOW'))

  const notClickable = enquiry.enquireStatus === TermStatus.Pending

  const isDeclined = enquiry.enquireStatus === TermStatus.Declined

  return (
    <Container
      isPending={isPending}
      isUnattended={isUnattended}
      notClickable={notClickable}
      onClick={() => {
        if (!notClickable && !cancelPopup) {
          history.push(`/enquiry/${enquiry.enquireId}/chat`)
          if (hasNotifications) {
            dispatch(actions.resetNotifications(enquiry.enquireId))
          }
        }
      }}>
      {hasNotifications && <RedSpot />}
      {!isPending && !isClosed ? (
        <DeleteButton
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation()
            setCancelPopup(!cancelPopup)
          }}>
          &#9587;
        </DeleteButton>
      ) : null}
      <AvatarConatiner>
        {isLandlord ? (
          <AvatarWithName>
            <Avatar
              userId={peerId}
              isLandlord={!isLandlord}
              isDefaultImage={isUnaccepted || isClosed}
            />
            {!isUnaccepted && !isClosed && <DisplayName userId={peerId} />}
          </AvatarWithName>
        ) : (
          <Photo>
            <img src={photo} alt="enquiry space" />
          </Photo>
        )}
        {!isClosed && !isDeclined ? (
          <ShowUnreadAndTime
            isPending={
              isPending || enquiry.enquireStatus === TermStatus.Pending
            }
            isUnattended={isUnattended}
            unreadMessages={unreadMessages}
            sinceWhen={sinceWhen}
            isLandlord={isLandlord}
            eventType={get(enquiry, 'lastActivityDetails.eventType')}
          />
        ) : null}
        {isDeclined && (
          <ActivityText>
            <TextWhen>
              <TextDeclined>{t('YOUR_ENQUIRES_DECLINED')}</TextDeclined>
            </TextWhen>
          </ActivityText>
        )}
      </AvatarConatiner>
      <ContainerMain>
        <Headline>{title}</Headline>
        <Street>{street}</Street>
        {enquiry.flex ? (
          <FlexSpaceDetail
            space={glSpace}
            type={enquiry.flexType}
            flexIdentifier={enquiry.flexIdentifier as number}
          />
        ) : (
          <FixedSpaceDetail space={glSpace} />
        )}
      </ContainerMain>
      <ContainerLease>
        <LeaseTitle>{t('YOUR_ENQUIRIES_LEASE_REQUEST')}</LeaseTitle>
        <InfoContainer>
          <Data
            isThird={true}
            value={`${fieldsValues.duration} ${t('NEGOTIATE_MONTHS')}`}
            label={t('YOUR_ENQUIRIES_LENGTH')}
          />
          <Data
            isThird={true}
            value={
              fieldsValues.start ? formatDate(new Date(fieldsValues.start)) : ''
            }
            label={t('YOUR_ENQUIRIES_STARTS')}
          />
          {enquiry.flex && enquiry.flexType === EnquiryType.HotDesk && (
            <Data
              isThird={true}
              value={fieldsValues.noOfDesks || 0}
              label={t('YOUR_ENQUIRIES_HOT_DESKS')}
            />
          )}
          {enquiry.flex && enquiry.flexType === EnquiryType.FixedDesk && (
            <Data
              isThird={true}
              value={fieldsValues.noOfDesks || 0}
              label={t('YOUR_ENQUIRIES_FIXED_DESKS')}
            />
          )}
        </InfoContainer>
      </ContainerLease>
      <ContainerActivity>
        {isPending ? (
          <ButtonsContainer>
            <ButtonDecline
              data-testid="enquiry-decline"
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => {
                event.stopPropagation()
                dispatch(
                  actionsMyEnquiries.reject(enquiry.enquireId.toString()),
                )
              }}>
              {t('YOUR_ENQUIRES_DECLINE')}
            </ButtonDecline>
            <ButtonAccept
              data-testid="enquiry-accept"
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => {
                event.stopPropagation()
                dispatch(
                  actionsMyEnquiries.accept(enquiry.enquireId.toString()),
                )
              }}>
              {t('YOUR_ENQUIRES_ACCEPT')}
            </ButtonAccept>
          </ButtonsContainer>
        ) : null}
        {!isClosed && !isDeclined ? (
          <ShowUnreadAndTime
            isPending={
              isPending || enquiry.enquireStatus === TermStatus.Pending
            }
            isUnattended={isUnattended}
            unreadMessages={unreadMessages}
            sinceWhen={sinceWhen}
            isLandlord={isLandlord}
            eventType={get(enquiry, 'lastActivityDetails.eventType')}
          />
        ) : null}
        {isDeclined && (
          <ActivityText>
            <TextWhen>
              <TextDeclined>{t('YOUR_ENQUIRES_DECLINED')}</TextDeclined>
            </TextWhen>
          </ActivityText>
        )}
      </ContainerActivity>
      {cancelPopup && (
        <FeedbackDialog
          open={cancelPopup}
          setOpen={setCancelPopup}
          onClick={cancelEnquiry}
          title={t('YOUR_ENQUIRES_REMOVE_ENQUIRY_POPUP_TITLE')}
          cancelText={t('YOUR_ENQUIRES_REMOVE_ENQUIRY_POPUP_TITLE_KO')}
          okText={t('YOUR_ENQUIRES_REMOVE_ENQUIRY_POPUP_TITLE_OK')}
          whyText={t('YOUR_ENQUIRES_REMOVE_ENQUIRY_POPUP_WHY')}
          useText={t('YOUR_ENQUIRES_REMOVE_ENQUIRY_POPUP_USE')}
        />
      )}
    </Container>
  )
}
export default Enquiry
