import React, { useState, Dispatch, SetStateAction } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import Popover from '@material-ui/core/Popover'
import enquiryActions from 'services/myEnquiries/actions'

import selectors from 'services/user/selectors'
import actions from 'services/user/actions'
import { Link } from 'react-router-dom'
import dashboardActions from 'services/dashboard/actions'
import { useNotificationCount } from 'services/myEnquiries/hooks'

import Avatar from 'components/Avatar/Avatar'
import FilledButton from 'components/common/FilledButton'
import device from 'services/global/device'
import Close from '@material-ui/icons/Close'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import EditProfile from './EditProfile'
import { useProfile } from 'services/user/hooks'
import company from 'assets/icons/company.svg'
import enquiries from 'assets/icons/enquiries.svg'
import analytics from 'services/analytics'

const CloseIcon = styled(Close)`
  display: none;
  position: absolute;
  top: 5px;
  right: 10px;
`
const ContainerAvatar = styled.div`
  flex: 0 0 54px;
  padding: 10px 20px 0 0;

  @media ${device.mobile} {
    padding: 20px 30px 0 0;
  }
`
const LinkBadge = styled.div`
  background-color: #db4437;
  text-align: center;
  border-radius: 50%;
  color: white;
  padding: 5px 6px;
  line-height: 9px;
  font-size: 11px;
  margin-left: 10px;
`
const Img = styled.img`
  height: 30px;
`
const Text = styled.span`
  display: inline-block;
`
const UserProfileContentContainer = styled.div`
  position: relative;
  width: 360px;
  padding: 10px;
  @media (max-width: 480px) {
    padding: 0;
    width: 100vw;
  }
`
const ContainerFlex = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin: 0 10px;

  @media ${device.mobile} {
    margin: 0 20px;
    padding-top: 10px;
  }
`
const ContainerInfo = styled.div`
  padding: 10px 0 5px;

  @media ${device.mobile} {
    padding: 20px 0 5px;
  }
`
const Name = styled.div`
  color: #000000;
  font-size: 18px;
  font-weight: bold;
`
const Email = styled.div`
  color: #828286;
  font-size: 16px;
  font-weight: 400;
  padding: 5px 0 10px 0;
`
const UserProfileButton = styled(FilledButton)`
  color: #f35c2b;
  background: transparent;
  padding: 0;
  outline: 0;
`
const SignOut = styled.button`
  display: block;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  margin: 20px auto 10px;
  padding-top: 0;
  border: none;
  cursor: pointer;
  background: #f35c2b;
  padding: 8px 40px;
  border-radius: 4px;
  outline: none;

  @media ${device.mobile} {
    margin: 20px auto;
  }
`

const LinkItem = styled.li`
  white-space: nowrap;
  margin: 0 20px;
  font-size: 16px;
  font-weight: 500;
  list-style: none;
  cursor: pointer;
  border-bottom: 1px solid #dddddd;

  a {
    display: flex;
    align-items: center;
    padding: 15px 10px 15px 104px;
    border: 2px solid transparent;
    text-decoration: none;
    transition: 0.3s;
    color: #404042;
    outline: none;
    font-size: 17px;
    font-weight: normal;

    @media ${device.mobile} {
      padding: 15px 10px 15px 80px;
    }

    img {
      margin-right: 20px;
      width: 32px;
    }
    :hover {
      color: #404042;
      border-bottom: 2px solid white;
    }
    :focus {
      color: #404042;
      border-bottom: 2px solid white;
    }
  }
`
const LinksList = styled.ul`
  margin: 0;
  padding: 0;
`
const UserProfileContent = (props: {
  setShow: Dispatch<SetStateAction<boolean>>
}) => {
  const { setShow } = props
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const isLandlord = useSelector(selectors.isLandlord)
  const ownUserId = useSelector(selectors.accountIdentifier)
  const profile = useProfile(ownUserId)
  const userName = profile ? profile.displayName : ''
  const userEmail = profile ? profile.emailId : ''
  const [edit, setEdit] = useState(false)
  const logout = () => {
    dispatch(actions.logout())
  }

  const isMobile = useMediaQuery(device.mobile)
  const notifications = useNotificationCount()
  analytics.gtmEvent(useSelector(selectors.getGAUser))

  const eventClickGa = (action: string) =>
    analytics.event({
      category: 'Header navigation',
      action,
    })

  const refresh = () => {
    dispatch(dashboardActions.dashboardInit())
    eventClickGa('My spaces')
  }

  const refreshEnquiries = () => {
    dispatch(enquiryActions.get())
    eventClickGa('Enquiries')
  }

  if (edit) {
    return (
      <UserProfileContentContainer>
        <CloseIcon onClick={() => setShow(false)} />
        <EditProfile setShow={setEdit} />
      </UserProfileContentContainer>
    )
  }
  return (
    <UserProfileContentContainer>
      <CloseIcon onClick={() => setShow(false)} />
      <ContainerFlex>
        <ContainerAvatar>
          <Avatar isLandlord={isLandlord} userId={ownUserId} />
        </ContainerAvatar>
        <ContainerInfo>
          <Name>{userName}</Name>
          <Email>{userEmail}</Email>
          <UserProfileButton onClick={() => setEdit(true)}>
            {t('NAV_EDIT_PROFILE')}
          </UserProfileButton>
        </ContainerInfo>
      </ContainerFlex>
      {isMobile && (
        <LinksList>
          <LinkItem data-testid="enquiries">
            <Link to="/enquiries" onClick={refreshEnquiries}>
              <Img src={enquiries} alt="enquiries" />
              <Text>{t('NAV_ENQUIRIES')}</Text>
              {notifications > 0 && <LinkBadge>{notifications}</LinkBadge>}
            </Link>
          </LinkItem>
          {isLandlord && (
            <LinkItem data-testid="dashboard">
              <Link to="/dashboard" onClick={refresh}>
                <Img src={company} alt="spaces" />
                <Text>{t('NAV_SPACES')}</Text>
              </Link>
            </LinkItem>
          )}
        </LinksList>
      )}
      <SignOut data-testid="logout" onClick={logout}>
        {t('NAV_SIGN_OUT')}
      </SignOut>
    </UserProfileContentContainer>
  )
}

const UserProfile = (props: {
  setShow: Dispatch<SetStateAction<boolean>>
  show: boolean
  anchorEl?: Element | null
}) => {
  const { setShow, show, anchorEl } = props

  return (
    <Popover
      id="userpopover"
      open={show}
      onClose={() => setShow(false)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}>
      <UserProfileContent setShow={setShow} />
    </Popover>
  )
}
export default UserProfile
