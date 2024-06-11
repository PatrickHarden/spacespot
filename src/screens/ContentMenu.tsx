import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import device from 'services/global/device'
import Popover from '@material-ui/core/Popover'
import { getLangPrefix } from 'intl'

const ContentMenuBar = styled.div`
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    color: white;
    line-height: 23px;
    margin-left: 30px;
    font-size: 18px;
  }
`

const MobileMenuBar = styled.div`
  a {
    display: block;
    text-decoration: none;
    color: #000;
    line-height: 23px;
    font-size: 18px;
    padding: 15px 0 0;
    margin: 15px 0;

    + a {
      border-top: 1px solid #ddd;
    }
  }
`

const Button = styled.button`
  padding: 0;
  border: 0;
  background: none;
  outline: 0;
  cursor: pointer;

  &.active {
    span:first-child {
      -webkit-transform: rotate(-45deg) translate(-9px, 6px);
        transform: rotate(-45deg) translate(-9px, 1px);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:last-child {
      -webkit-transform: rotate(45deg) translate(-8px, -8px);
      transform: rotate(45deg) translate(-8px, -1px);
    }
  }
    
  }
`
const Hamburger = styled.span`
  display: block;
  width: 26px;
  height: 2px;
  background: #fff;
  margin: 5px 0;
  cursor: pointer;
  transition: 0.3s;
`

const MobileContainer = styled.div`
  display: block;
`

const ContentMenu = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const prefix = getLangPrefix()
  const isMobile = useMediaQuery(device.lessThanIPad)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return isMobile ? (
    <MobileContainer>
      <Button onClick={handleClick} className={open ? 'active' : ''}>
        <Hamburger></Hamburger>
        <Hamburger></Hamburger>
        <Hamburger></Hamburger>
      </Button>
      <Popover
        id="context-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <MobileMenuBar>
          <Link to={`${prefix}/office-space`}>{t('HS_C_MENU_OFFICE')}</Link>
          <Link to={`${prefix}/coworking`}>{t('HS_C_MENU_COWORKING')}</Link>
          <Link to={t('ABOUT_US_LINK')}>{t('HS_C_MENU_ABOUT_US')}</Link>
        </MobileMenuBar>
      </Popover>
    </MobileContainer>
  ) : (
    <ContentMenuBar>
      <Link to={`${prefix}/office-space`}>{t('HS_C_MENU_OFFICE')}</Link>
      <Link to={`${prefix}/coworking`}>{t('HS_C_MENU_COWORKING')}</Link>
      <Link to={t('ABOUT_US_LINK')}>{t('HS_C_MENU_ABOUT_US')}</Link>
    </ContentMenuBar>
  )
}

export default ContentMenu
