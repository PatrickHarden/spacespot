import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'

import Header1 from 'components/common/Heading1'
import Header2 from 'components/common/Heading2'
import OutlinedButton from 'components/common/OutlinedButton'

import down from 'assets/icons/down.svg'
import spot from 'assets/img/spot-illustration.svg'
import chat from 'assets/img/chat-illustration.svg'
import sign from 'assets/img/sign-illustration.svg'
import free from 'assets/img/free-icon.svg'
import online from 'assets/img/online-icon.svg'
import easy from 'assets/img/easy-icon.svg'

import office from 'assets/img/office-space.jpg'
import coworking from 'assets/img/coworking-space.jpg'

import LandlordContact from 'components/SubHome/LandlordContact'
import { routingLang } from 'intl'

const H1 = styled(Header1)`
  color: black;
  text-align: center;
`

const H2 = styled(Header2)`
  color: black;
`

const CH2 = styled(H2)`
  text-align: center;
`

const FeatH3 = styled.h3`
  color: black;
  font-size: 22px;
  font-weight: 400;
`

const OButton = styled(OutlinedButton)`
  color: #404042;
  border-color: #404042;
`

const H3 = styled.div`
  color: black;
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;
`

const Container = styled.div``

const WhiteBg = styled.div`
  background-color: #ffffff;
  padding: 40px 0 46px 0;
`

const GreyBg = styled.div`
  background-color: #fafafa;
  padding: 40px 0 46px 0;
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1260px;
  margin: 0 auto;
`

const Feat = styled.div`
  text-align: center;
  width: 250px;
  margin: 0 20px 50px 0;
  p {
    color: #404042;
  }
`

const About = styled.div`
  background-color: #ffffff;
  padding: 40px 20px 66px 20px;
  text-align: center;
  max-width: 830px;
  margin: 0 auto;
  hr {
    margin-top: 80px;
    color: #dddddd;
    max-width: 400px;
    border-style: solid;
    border-top: none;
  }
  p {
    color: #404042;
  }
`

const SpaceTypes = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 30px;
  justify-content: center;
  div {
    flex: 0 0 auto;
    width: 100%;
    max-width: 600px;
    margin: 0 12px 48px 12px;
    img {
      width: 100%;
      object-fit: cover;
    }
    h2 {
      margin: 12px 0;
    }
    p {
      margin: 12px 0;
      color: #404042;
      font-size: 16px;
    }
  }
`

const Panels = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 920px;
  margin: 0 auto;
  padding-bottom: 20px;
`

const Panel = styled(ExpansionPanel)`
  flex: 0 0 auto;
  max-width: 400px;
  width: 100%;
  &.MuiPaper-elevation1 {
    box-shadow: none;
  }
  &.MuiExpansionPanel-root:before {
    height: 0px;
    background-color: white;
    transition: none;
  }
  &.MuiExpansionPanel-root.Mui-expanded {
    margin: 0;
  }
  .MuiExpansionPanelSummary-root.Mui-expanded {
    min-height: unset;
  }
  .MuiExpansionPanelSummary-content.Mui-expanded {
    margin: 5px 0 0 0;
  }
  .MuiExpansionPanelDetails-root {
    color: #404042;
  }
`
const Contact = styled.div`
  margin-top: 50px;
  text-align: center;
`

const ButtonLink = styled.a`
  display: inline-block;
  color: #f35c2b;
  border: 1px solid #f35c2b;
  font-size: 14px;
  font-weight: 550;
  background-color: #ffffff;
  border-radius: 2px;
  cursor: pointer;
  text-transform: uppercase;
  padding: 8px 20px;
  text-decoration: none;
`

const expandIcon = <img src={down} alt="expand" />

export const Home = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <Container>
      <WhiteBg data-auto="home-spacespotting">
        <H1>{t('HOME_TITLE')}</H1>
        <Row>
          <Feat>
            <img src={spot} alt="spot" />
            <H2>{t('HOME_SPOT_TITLE')}</H2>
            <p>{t('HOME_SPOT_TEXT')}</p>
          </Feat>
          <Feat>
            <img src={chat} alt="chat" />
            <H2>{t('HOME_CHAT_TITLE')}</H2>
            <p>{t('HOME_CHAT_TEXT')}</p>
          </Feat>
          <Feat>
            <img src={sign} alt="sign" />
            <H2>{t('HOME_SIGN_TITLE')}</H2>
            <p>{t('HOME_SIGN_TEXT')}</p>
          </Feat>
        </Row>
      </WhiteBg>
      <GreyBg data-auto="home-why">
        <CH2>{t('HOME_WHY_TITLE')}</CH2>
        <Row>
          <Feat>
            <img src={easy} alt="easy" />
            <FeatH3>{t('HOME_EASY_TITLE')}</FeatH3>
            <p>{t('HOME_EASY_TEXT')}</p>
          </Feat>
          <Feat>
            <img src={online} alt="online" />
            <FeatH3>{t('HOME_ONLINE_TITLE')}</FeatH3>
            <p>{t('HOME_ONLINE_TEXT')}</p>
          </Feat>
          <Feat>
            <img src={free} alt="free" />
            <FeatH3>{t('HOME_FREE_TITLE')}</FeatH3>
            <p>{t('HOME_FREE_TEXT')}</p>
          </Feat>
        </Row>
      </GreyBg>
      <About data-auto="home-about">
        <H2>{t('HOME_ABOUT_TITLE')}</H2>
        <p>{t('HOME_ABOUT_P1')}</p>
        <p>{t('HOME_ABOUT_P2')}</p>
        <Link
          to={routingLang({
            nb: '/nb-no/om-oss',
            fi: '/fi-fi/meistä',
            de: '/de-de/ueber-uns',
            es: '/es-es/sobre-nosotros',
            default: '/en/about-us',
          })}>
          <OButton>{t('HOME_ABOUT_US_BUTTON')}</OButton>
        </Link>
        <hr />
      </About>
      <SpaceTypes>
        <div data-auto="home-types-office">
          <img src={office} alt="office" />
          <H2>{t('HOME_TYPES_OFFICE')}</H2>
          <p>{t('HOME_TYPES_OFFICE_TEXT')}</p>
          <Link
            to={routingLang({
              nb: '/nb-no/kontor',
              fi: '/fi-fi/toimitila',
              de: '/de-de/büroräumen',
              es: '/es-es/espacios-oficinas',
              default: '/en/office-space',
            })}>
            <OButton data-auto="home-button-offices">
              {t('HOME_TYPES_CTA')}
            </OButton>
          </Link>
        </div>
        <div data-auto="home-types-coworking">
          <img src={coworking} alt="coworking" />
          <H2>{t('HOME_TYPES_COWORKING')}</H2>
          <p>{t('HOME_TYPES_COWORKING_TEXT')}</p>
          <Link
            to={routingLang({
              nb: '/nb-no/coworking',
              fi: '/fi-fi/coworking',
              de: '/de-de/coworking',
              es: '/es-es/coworking',
              default: '/en/coworking',
            })}>
            <OButton data-auto="home-button-coworking">
              {t('HOME_TYPES_CTA')}
            </OButton>
          </Link>
        </div>
      </SpaceTypes>
      <WhiteBg data-auto="home-data-auto">
        <CH2>{t('HOME_WYN_TITLE')}</CH2>
        <Panels>
          <Panel>
            <ExpansionPanelSummary expandIcon={expandIcon}>
              <H3>{t('HOME_FIXED_FLEX_TITLE')}</H3>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {t('HOME_FIXED_FLEX_TEXT')}
            </ExpansionPanelDetails>
          </Panel>
          <Panel>
            <ExpansionPanelSummary expandIcon={expandIcon}>
              <H3>{t('HOME_FLEX_TYPE_TITLE')}</H3>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {t('HOME_FLEX_TYPE_TEXT')}
            </ExpansionPanelDetails>
          </Panel>
          <Panel>
            <ExpansionPanelSummary expandIcon={expandIcon}>
              <H3>{t('HOME_HOW_MUCH_TITLE')}</H3>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <span>
                {t('HOME_HOW_MUCH_TEXT')}
                <br />
                {t('HOME_HOW_MUCH_TEXT2')}
                &nbsp;
                <a
                  href={t('MARKETING_EMAIL_ID')}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('HOME_CONTACT_AN_ADVISOR')}
                </a>
              </span>
            </ExpansionPanelDetails>
          </Panel>
          <Panel>
            <ExpansionPanelSummary expandIcon={expandIcon}>
              <H3>{t('HOME_WHAT_INCLUDED_TITLE')}</H3>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {t('HOME_WHAT_INCLUDED_TEXT')}
              <br />
              {t('HOME_WHAT_INCLUDED_TEXT2')}
            </ExpansionPanelDetails>
          </Panel>
        </Panels>
        <Contact>
          <p>{t('HOME_DONT_FIND')}</p>
          <ButtonLink
            href={t('MARKETING_EMAIL_ID')}
            target="_blank"
            rel="noopener noreferrer">
            {t('HOME_CONTACT_ADVISOR')}
          </ButtonLink>
        </Contact>
      </WhiteBg>
      <LandlordContact />
    </Container>
  )
}

export default Home
