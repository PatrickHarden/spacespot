import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import LogoImg from 'assets/img/logo.svg'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import selectors from 'services/user/selectors'
import Colors from 'assets/Colors'
import SessionDialog from './SessionDialog'
import CookieDialog from './CookieDialog'
import MobileHeader from './MobileHeader'
import DesktopHeader from './DesktopHeader'
import device from 'services/global/device'
import analytics from 'services/analytics'
import ContentMenu from 'screens/ContentMenu'

const Container = styled.div<{ noBackground?: boolean }>`
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  padding: 13px 19px 13px 19px;
  background-color: ${props =>
    props.noBackground ? 'initial' : Colors.main.headerBg};
`
const Logo = styled.div`
  display: flex;
  margin-left: 24px;
  > a {
    margin-right: 60px;
  }
  height: 28px;

  @media ${device.lessThanIPad} {
    margin-left: 0;
    > a {
      margin-right: 15px;
    }
  }
`
const Header = (props: { hideMobile?: boolean; noBackground?: boolean }) => {
  const { hideMobile, noBackground } = props
  analytics.gtmEvent(useSelector(selectors.getGAUser))

  const eventClickGa = (action: string) =>
    analytics.event({
      category: 'Header navigation',
      action,
    })

  const isMobile = useMediaQuery(device.mobile)
  if (isMobile && hideMobile) {
    return null
  }
  return (
    <Container noBackground={noBackground}>
      <SessionDialog />
      <CookieDialog />
      <Logo>
        <Link to={'/'} onClick={() => eventClickGa('logo')}>
          <img height="28px" alt="SpaceSpot Logo" src={LogoImg} />
        </Link>
        <ContentMenu />
      </Logo>
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
    </Container>
  )
}
export default Header
