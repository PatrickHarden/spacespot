import React, { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import negotiationActions from 'services/negotiation/actions'
import eventActions from 'services/event/actions'
import chatActions from 'services/chat/actions'
import selectors from 'services/enquiry/selectors'

import Colors from '../../assets/Colors'

import BackArrow from 'components/icons/BackArrow'

import MainHeader from '../MainLayout/Header'
import device from 'services/global/device'
import history from 'browserhistory'

const headerHeight = 90
const MobileHeader = styled.div`
  background: white;
  width: 100vw;
  max-width: 100%;
  height: 44px;
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  line-height: 44px;
  span {
    padding-right: 26px;
  }
`

const LowerLinkContainer = styled.ul`
  background-color: #f4f4f4;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin: 0;
  padding: 0;
  list-style-type: none;
  li {
    padding-top: 0px;
    display: inline-block;
  }
  @media ${device.mobile} {
    height: 30px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    padding-top: 10px;
    li {
      width: 33.33%;
      text-align: center;
    }
  }
`

interface LinkProps {
  className?: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  to: string
  children: ReactNode
}

const LowerLink = styled((props: LinkProps) => {
  return (
    <li>
      <Link
        tabIndex={0}
        className={props.className}
        to={props.to}
        onClick={props.onClick ? props.onClick : undefined}>
        {props.children}
      </Link>
    </li>
  )
})`
  :link {
    text-decoration: none;
    text-transform: uppercase;
    pointer-events: ${props => (props.disabled ? 'none' : 'unset')};
  }
  :focus {
    outline: none;
  }
  @media ${device.mobile} {
    display: inline-block;
    font-size: 14px;
    font-weight: ${props => (props.selected ? '500' : '400')}
    line-height: 14px;
    margin-right: 0;
    margin-bottom: ${props => (props.selected ? '2px' : '6px')};
    padding-bottom: 9px;
  }
  margin-bottom: 0;
  margin-right: 3em;
  color: ${props => (props.disabled ? Colors.main.darkGrey : 'black')};
  padding: 0 1em 10px 1em;
  border-bottom: ${props =>
    props.selected ? `4px solid ${Colors.main.orange}` : 'none'};
  font-size: 18px;
  font-weight: ${props => (props.selected ? 500 : 400)};
  line-height: 26px;
  text-transform: uppercase;
`
const Container = styled.div<{ hide: boolean }>`
  @media ${device.mobile} {
    position: fixed;
    transition: top 0.2s ease-in-out;
    z-index: 2;
    top: ${props => (props.hide ? `-${headerHeight}px` : '0px')};
  }
`
const BackButton = styled(BackArrow)`
  float: left;
  padding: 10px;
  margin: 5px;
`
const Header = (props: { hide: boolean }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  const location = useLocation()
  const path = location.pathname.split('/').pop()
  const isMobile = useMediaQuery(device.mobile)
  const dispatch = useDispatch()
  const enquiryId = useSelector(selectors.getEnquiryId)
  const refreshNegotiations = () => dispatch(negotiationActions.get())
  const refreshChat = () => {
    dispatch(chatActions.get())
    dispatch(eventActions.get(enquiryId.toString()))
  }

  const enquiriesBack = () => {
    history.goBack()
  }
  return (
    <Container hide={props.hide}>
      <MainHeader hideMobile={true} />
      {isMobile && (
        <MobileHeader>
          <BackButton onClick={enquiriesBack} title={t('ONBOARDING_BACK')} />
          <span>{t('NAV_MOBILE_YOUR_ENQUIRIES')}</span>
        </MobileHeader>
      )}
      <LowerLinkContainer>
        <LowerLink selected={path === 'space'} to="space">
          {t('NAV_SPACE_DETAILS')}
        </LowerLink>
        <LowerLink selected={path === 'chat'} to="chat" onClick={refreshChat}>
          {t('NAV_CHATSHARE')}
        </LowerLink>
        <LowerLink
          selected={path === 'negotiate'}
          to="negotiate"
          onClick={refreshNegotiations}>
          {isMobile ? t('NAV_NEGOTIATESIGN_MOBILE') : t('NAV_NEGOTIATESIGN')}
        </LowerLink>
      </LowerLinkContainer>
    </Container>
  )
}
export default Header
