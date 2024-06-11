import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import selectors from 'services/user/selectors'
import actions from 'services/user/actions'
import dashboardActions from 'services/dashboard/actions'
import enquiryActions from 'services/myEnquiries/actions'

import device from 'services/global/device'
import UserProfile from './UserProfile'
import { useProfile } from 'services/user/hooks'
import Avatar from 'components/Avatar/Avatar'
import usermenu from 'assets/icons/usermenu.svg'
import searchIcon from 'assets/icons/search.svg'
import spacesIcon from 'assets/icons/spaces.svg'
import enquiryIcon from 'assets/icons/enquiry.svg'
import analytics from 'services/analytics'
import { getLangPrefix } from 'intl'
import { useNotificationCount } from 'services/myEnquiries/hooks'
import LangPicker from './LangPicker'

const Text = styled.span`
  @media ${device.mobile} {
    display: none;
  }
`

const Img = styled.img`
  height: 30px;
`

const HeaderAvatar = styled(Avatar)`
  flex: 0 0 auto;
  margin-left: 6px;
  height: 29px;
  width: 29px;
`

const LinksList = styled.ul`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`
const LinkItem = styled.li`
  position: relative;
  margin-left: 1em;
  white-space: nowrap;
  display: inline-block;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  a {
    display: flex;
    align-items: center;
    border: 2px solid transparent;
    padding: 4px 5px;
    text-decoration: none;
    transition: 0.3s;
    color: #ffffff;
    outline: none;
    img {
      margin-right: 6px;
    }
    :hover {
      color: #ffffff;
      border-bottom: 2px solid white;
    }
    :focus {
      color: #ffffff;
      border-bottom: 2px solid white;
    }
  }

  @media ${device.mobile} {
    margin-left: 1em;
  }

  @media (max-width: 480px) {
    margin-left: 0.5em;
  }
`

const LinkBadge = styled.div`
  position: absolute;
  left: -2px;
  top: 3px;
  background-color: #db4437;
  text-align: center;
  border-radius: 50%;
  color: white;
  padding: 5px 6px;
  line-height: 9px;
  font-size: 11px;
`

const ButtonBase = styled.button<{ upperCase?: boolean }>`
  display: flex;
  align-items: center;
  text-transform: ${p => (p.upperCase ? 'uppercase' : 'none')}
  font-size: 16px;
  font-weight: 500;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
  img {
    margin-right: 6px;
  }
  `

const Button = styled(ButtonBase)`
  border-bottom: 2px solid transparent;
  outline: none;
  :hover {
    border-bottom: 2px solid white;
  }
  :focus {
    border-bottom: 2px solid white;
  }
  padding: 8px 5px 7px 5px;
`

const ProfileButton = styled(ButtonBase)`
  border: 2px solid transparent;
  padding: 5px 3px 4px 3px;
  outline: none;
  :hover {
    border-bottom: 2px solid white;
  }
  :focus {
    border-bottom: 2px solid white;
  }
`

const BorderButton = styled(ButtonBase)`
  border: 1px solid white;
  border-radius: 18px;
  padding: 5px 15px;
  outline: none;
  background-color: #f35c2b;
  border-color: #f35c2b;
  :hover {
    background-color: #f35c2b;
  }
  :focus {
    background-color: #f35c2b;
  }
`

const LinkItemRelative = styled(LinkItem)`
  position: relative;
`

const DesktopHeader = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const id = useSelector(selectors.accountIdentifier)
  const profile = useProfile(id)
  const name = profile ? profile.displayName : ''
  const isLogged = useSelector(selectors.isLogged)
  const isLandlord = useSelector(selectors.isLandlord)

  const dispatch = useDispatch()
  const [showProfile, setShowProfile] = useState(false)
  const showName = !name || name === 'unknown' ? t('NAV_NO_NAME') : name
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const prefix = getLangPrefix()
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
  const openProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setShowProfile(true)
    eventClickGa('My account')
  }

  return (
    <>
      {isLogged ? (
        <LinksList>
          {!isLandlord && (
            <LinkItem data-testid="search">
              <Link to={`${prefix}/list`}>
                <Img src={searchIcon} alt="list" />
                <Text>{t('NAV_SEARCH')}</Text>
              </Link>
            </LinkItem>
          )}
          {isLandlord && (
            <LinkItem data-testid="dashboard">
              <Link to="/dashboard" onClick={refresh}>
                <Img src={spacesIcon} alt="spaces" />
                <Text>{t('NAV_SPACES')}</Text>
              </Link>
            </LinkItem>
          )}
          <LinkItem data-testid="enquiries">
            <Link to="/enquiries" onClick={refreshEnquiries}>
              <Img src={enquiryIcon} alt="enquiries" />
              <Text>{t('NAV_ENQUIRIES')}</Text>
              {notifications > 0 && <LinkBadge>{notifications}</LinkBadge>}
            </Link>
          </LinkItem>
          <LinkItemRelative>
            <ProfileButton data-testid="profile" onClick={openProfile}>
              <Text>{showName}</Text>
              <HeaderAvatar userId={id} isLandlord={isLandlord} palette={2} />
            </ProfileButton>
            <UserProfile
              setShow={setShowProfile}
              show={showProfile}
              anchorEl={anchorEl}
            />
          </LinkItemRelative>
        </LinksList>
      ) : (
        <LinksList>
          <LinkItem>
            <LangPicker />
          </LinkItem>
          <LinkItem>
            <Button
              upperCase={false}
              data-testid="signin"
              onClick={() => {
                dispatch(actions.loginInit())
                eventClickGa('Log in')
              }}>
              <img src={usermenu} height="23px" alt="sign in" />
              {t('HEADER_SIGN_IN')}
            </Button>
          </LinkItem>
          <LinkItem>
            <BorderButton
              upperCase={false}
              data-testid="signup"
              onClick={() => {
                dispatch(actions.signUp())
                eventClickGa('Sign up')
              }}>
              {t('HEADER_SIGN_UP')}
            </BorderButton>
          </LinkItem>
        </LinksList>
      )}
    </>
  )
}
export default DesktopHeader
