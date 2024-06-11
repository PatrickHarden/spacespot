import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import selectors from 'services/user/selectors'
import actions from 'services/user/actions'
import device from 'services/global/device'
import UserProfile from './UserProfile'
import usermenu from 'assets/icons/usermenu.svg'
import searchIcon from 'assets/icons/search.svg'
import analytics from 'services/analytics'
import { getLangPrefix } from 'intl'
import LangPicker from './LangPicker'
import { useNotificationCount } from 'services/myEnquiries/hooks'
import Popover from '@material-ui/core/Popover'

const Text = styled.span`
  @media ${device.mobile} {
    display: none;
  }
`
const LinkBadge = styled.div`
  position: absolute;
  right: -12px;
  top: -8px;
  background-color: #db4437;
  text-align: center;
  border-radius: 50%;
  color: white;
  padding: 5px 6px;
  line-height: 9px;
  font-size: 11px;
`

const Img = styled.img`
  height: 30px;
`

const LinksList = styled.ul`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`
const LinkItem = styled.li`
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

    :hover {
      color: #ffffff;
      border-bottom: 2px solid white;
    }
    :focus {
      color: #ffffff;
      border-bottom: 2px solid white;
    }
  }
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
  padding: 0;
  outline: none;
  position: relative;

  img {
    margin: 0;
  }
`

const BorderButton = styled(ButtonBase)`
  border: 1px solid #6cb9d5;
  min-width: 180px;
  border-radius: 4px;
  height: 40px;
  text-align: center;
  padding: 5px 15px;
  outline: none;
  border-color: #6cb9d5;
  :hover {
    background-color: #6cb9d5;
  }
  :focus {
    background-color: #6cb9d5;
  }
`
const LinkItemRelative = styled(LinkItem)`
  position: relative;
`
const ButtonContainerWrapper = styled.div`
  display: flex;
`
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;

  button:last-child {
    margin-left: 1rem;
  }

  @media (max-width: 769px) {
    width: 100%;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    button {
        :last-child{
        margin-left: 0;
        color: #6cb9d5;
        justify-content: center;
      }

      :first-child {
        background: #f35c2b;
        color: #fff;
        min-width: 180px;
        height: 40px;
        justify-content: center;
        margin-bottom: 20px;
        padding: 0;
        border-radius: 4px;

        img{
          margin-right: 20px;
        }
      }
    }
  }

    @media (max-width: 480px) {
        max-width: 100%;
      }
  }
`

const MobileButton = styled.button`
  display: inline-block;
  padding: 0;
  background: none;
  border: 0;
  margin-top: 3px;
  outline: 0;
`

const MobileHeader = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const isLogged = useSelector(selectors.isLogged)
  const isLandlord = useSelector(selectors.isLandlord)
  const dispatch = useDispatch()
  const [showProfile, setShowProfile] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const prefix = getLangPrefix()
  analytics.gtmEvent(useSelector(selectors.getGAUser))
  const notifications = useNotificationCount()
  const [
    anchorElement,
    setAnchorElement,
  ] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorElement)

  const eventClickGa = (action: string) =>
    analytics.event({
      category: 'Header navigation',
      action,
    })

  const openProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setShowProfile(true)
    eventClickGa('My account')
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(null)
  }

  return (
    <>
      {isLogged ? (
        <LinksList>
          {!isLandlord && (
            <LinkItem data-testid="search">
              <Link to={`${prefix}/list`}>
                <Img src={searchIcon} alt="list" width="22" height="22" />
                <Text>{t('NAV_SEARCH')}</Text>
              </Link>
            </LinkItem>
          )}

          <LinkItemRelative>
            <ProfileButton data-testid="profile" onClick={openProfile}>
              <img src={usermenu} height="23px" alt="sign in" />
              {notifications > 0 && <LinkBadge>{notifications}</LinkBadge>}
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
            <ButtonContainerWrapper>
              <MobileButton onClick={handleClick}>
                <img src={usermenu} height="23px" alt="sign in" />
              </MobileButton>

              <Popover
                id="mobilemenu"
                open={open}
                anchorEl={anchorElement}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}>
                <ButtonContainer>
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
                  <BorderButton
                    upperCase={false}
                    data-testid="signup"
                    onClick={() => {
                      dispatch(actions.signUp())
                      eventClickGa('Sign up')
                    }}>
                    {t('HEADER_SIGN_UP')}
                  </BorderButton>
                </ButtonContainer>
              </Popover>
            </ButtonContainerWrapper>
          </LinkItem>
        </LinksList>
      )}
    </>
  )
}
export default MobileHeader
