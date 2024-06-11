import React from 'react'
import { get } from 'lodash'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import device from 'services/global/device'

import favorite from 'assets/icons/favorite.svg'
import share from 'assets/icons/share.svg'
import back from 'assets/icons/back.svg'
import { Space } from 'services/space/types'
import { getFloorPlans } from 'services/space/helpers'
import { getLangPrefix } from 'intl'

const FavoriteBorder = () => <img src={favorite} alt="size" />
const Share = () => <img src={share} alt="calendar" />
const ArrowBack = () => <img src={back} alt="payment" />

const Border = styled.div`
  position: sticky;
  top: 0;
  background: white;
  width: 100%;
  border-bottom: 1px solid #ddd;
`

const NavLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  img {
    fill: black;
    margin-right: 5px;
  }
  span {
    font-size: 16px;
    font-weight: 400;
    color: black;
  }
`

const Align = styled.div`
  display: flex;
  align-items: center;
  img {
    margin-right: 5px;
  }
  span {
    font-size: 16px;
    font-weight: 400;
  }
`

const LinksBlock = styled.div`
  a {
    text-decoration: none;
    color: black;
    margin: 0 5px;
  }
  span {
    font-size: 16px;
    font-weight: 400;
  }
  @media ${device.mobile} {
    display: none;
  }
`

const Container = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    margin: 0 20px;
  }
`

const AllSpaces = styled.div`
  flex: 0 0 150px;
`

const NavIcon = styled.div`
  @media ${device.mobile} {
    display: none;
  }
`

const DetailsNav = (props: { isEnquiry?: boolean; space: Space }) => {
  const { isEnquiry, space } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const floorPlans = getFloorPlans(space)
  const matterPort = get(space, 'Common.Walkthrough', '')
  const prefix = getLangPrefix()

  const goto = (id: string) => (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault()
    const elmnt = document.getElementById(id)
    if (elmnt) elmnt.scrollIntoView()
  }

  return (
    <Border>
      <Container>
        <AllSpaces>
          {isEnquiry && (
            <NavLink to={`${prefix}/list`}>
              <ArrowBack />
              <span>{t('DETAILS_NAV_ALL_SPACES')}</span>
            </NavLink>
          )}
        </AllSpaces>
        <LinksBlock>
          <a href="#summary" onClick={goto('summary')}>
            {t('DETAILS_SUMMARY')}
          </a>
          &#xB7;
          <a href="#details" onClick={goto('details')}>
            {t('DETAILS_DETAILS')}
          </a>
          &#xB7;
          <a href="#ammenities" onClick={goto('ammenities')}>
            {t('DETAILS_AMMENITIES')}
          </a>
          &#xB7;
          {matterPort && (
            <>
              <a href="#virtualtour" onClick={goto('virtualtour')}>
                {t('DETAILS_VIRTUAL_TOUR')}
              </a>
              &#xB7;
            </>
          )}
          <a href="#photos" onClick={goto('photos')}>
            {t('DETAILS_PHOTOS')}
          </a>
          &#xB7;
          {floorPlans.length > 0 && (
            <>
              <a href="#floorplan" onClick={goto('floorplan')}>
                {t('DETAILS_FLOORPLAN')}
              </a>
              &#xB7;
            </>
          )}
          <a href="#location" onClick={goto('location')}>
            {t('DETAILS_LOCATION')}
          </a>
        </LinksBlock>
        <NavIcon>
          <Align style={{ visibility: 'hidden' }}>
            <FavoriteBorder />
            <span>{t('DETAILS_NAV_ADD_FAVORITE')}</span>
          </Align>
        </NavIcon>
        <NavIcon>
          <Align style={{ visibility: 'hidden' }}>
            <Share />
            <span>{t('DETAILS_NAV_SHARE')}</span>
          </Align>
        </NavIcon>
      </Container>
    </Border>
  )
}

export default DetailsNav
