import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'

import device from 'services/global/device'
import LogoImg from 'assets/img/logo.svg'
import facebook from 'assets/img/facebook.svg'
import instagram from 'assets/img/instagram.svg'
import linkedin from 'assets/img/linkedin.svg'

import Colors from 'assets/Colors'
import { getLangPrefix } from 'intl'

const Logo = styled.div`
  height: 28px;
  text-align: left;
`
const LeftContainer = styled.div`
  padding: 52px 0 64px 84px;
  ul {
    margin: 0;
    padding: 15px 0 0;
  }
  li {
    display: inline-block;
    margin: 0 2em;
    @media ${device.lessThanTablet} {
      display: block;
      margin: 0;
      text-align: left;
      white-space: nowrap;
      margin: 10px 0;
    }
  }
  li:first-child {
    margin-left: 0;
  }
  a {
    cursor: pointer;
    text-decoration: none;
    color: white;
    :focus {
      outline-color: ${Colors.main.orange};
    }
  }
  @media ${device.lessThanTablet} {
    padding: 15px 50px;
  }
  @media ${device.mobile} {
    padding: 15px;
  }
`

const RightContainer = styled.div`
  padding: 52px 84px 64px 0;
  text-align: right;
  ul {
    margin: 0;
    @media ${device.lessThanTablet} {
      display: inline-flex;
      padding: 0;
    }
  }
  li {
    display: inline-block;
    margin: 0 1em;
  }
  li:last-child {
    margin-right: 0;
  }
  @media ${device.lessThanTablet} {
    padding: 15px 0 0;
    margin-right: 50px;
  }
  @media ${device.mobile} {
    margin-right: 15px;

    li {
      margin: 0 0 0 0.5em;
    }
  }
`
const RightsReserved = styled.div`
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  padding-top: 10px;
  text-align: right;
  @media ${device.lessThanTablet} {
    display: none;
  }
`
const Container = styled.div`
  width: 100%;
  text-align: center;
  background-color: #404042;
`
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const RightsReservedTablet = styled(RightsReserved)`
  display: none;
  text-align: left;
  padding: 15px 50px;
  @media ${device.lessThanTablet} {
    display: block;
  }
  @media ${device.mobile} {
    padding: 15px 20px;
  }
`

const Footer = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const prefix = getLangPrefix()

  return (
    <Container data-auto="footer">
      <FlexContainer>
        <LeftContainer>
          <Logo>
            <Link to="/">
              <img height="28px" alt="SpaceSpot Logo" src={LogoImg} />
            </Link>
          </Logo>
          <ul>
            <li>
              <a href={t('MARKETING_EMAIL_ID')}>{t('FOOTER_CONTACT')}</a>
            </li>
            <li>
              <Link to={`${prefix}/privacy`}>{t('FOOTER_PRIVACY')}</Link>
            </li>
            <li>
              <Link to={`${prefix}/terms`}>{t('FOOTER_TERMS_OF_SERVICE')}</Link>
            </li>
            <li>
              <Link to={`${prefix}/cookie-policy`}>
                {t('FOOTER_COOKIE_POLICY')}
              </Link>
            </li>
            <li>
              <Link to={`${prefix}/list`}>{t('FOOTER_SEARCH')}</Link>
            </li>
          </ul>
        </LeftContainer>
        <RightContainer>
          <ul>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/myspacespot">
                <img
                  height="30px"
                  width="17px"
                  src={facebook}
                  alt={t('FOOTER_FACEBOOK')}
                />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/myspacespot">
                <img
                  height="30px"
                  width="30px"
                  src={instagram}
                  alt={t('FOOTER_INSTAGRAM')}
                />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/Spacespot">
                <img
                  height="30px"
                  width="30px"
                  src={linkedin}
                  alt={t('FOOTER_LINKEDIN')}
                />
              </a>
            </li>
          </ul>
          <RightsReserved>{t('FOOTER_RIGHTS_RESERVED')}</RightsReserved>
        </RightContainer>
      </FlexContainer>
      <RightsReservedTablet>{t('FOOTER_RIGHTS_RESERVED')}</RightsReservedTablet>
    </Container>
  )
}

export default Footer
