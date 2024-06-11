import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'

import Header from 'components/MainLayout/Header'
import Wizard from 'components/Wizard'
import Home from 'components/Wizard/Home'
import Footer from 'components/MainLayout/Footer'
import device from 'services/global/device'
import bgL from 'assets/img/home-bg-l.jpg'
import bgM from 'assets/img/home-bg-m.jpg'
import bgS from 'assets/img/home-bg-s.jpg'
import wgL from 'assets/img/home-bg-l.webp'
import wgM from 'assets/img/home-bg-m.webp'
import wgS from 'assets/img/home-bg-s.webp'
import CONFIG from 'config'

const Background = styled.div`
  background-color: #ddd;
  position: absolute;
  width: 100%;
  height: 100%;
`
const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  height: max(100%, 575px);
  @media ${device.mobile} {
    height: 42%;
  }
`

const BGImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Container = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`

const BackgroundHome = styled.div`
  background: white;
  height: 400px;
  width: 100%;
  position: absolute;
  top: 100%;
  top: max(100%, 575px);
`

export const HomeScreen = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <>
      <Helmet>
        <title>{t('SEO_TITLE_HOME')}</title>
        <meta name="description" content={t('SEO_DESCRIPTION_HOME')} />
        <link rel="canonical" href={`${CONFIG.CANONICAL_HOST}/`} />
      </Helmet>
      <Background>
        <BackgroundImage>
          <picture>
            <source
              type="image/webp"
              srcSet={`${wgS} 414w, ${wgM} 1366w, ${wgL} 1920w`}
              sizes="100vw"
            />
            <source
              type="image/jpg"
              srcSet={`${bgS} 414w, ${bgM} 1366w, ${bgL} 1920w`}
              sizes="100vw"
            />
            <BGImg src={bgL} alt="bg" />
          </picture>
          <Container>
            <Header noBackground={true} />
            <Wizard
              title={t('WIZARD_TITLE')}
              data-testid="WizardScreenWizard"
            />
          </Container>
        </BackgroundImage>
        <BackgroundHome>
          <Home />
          <Footer />
        </BackgroundHome>
      </Background>
    </>
  )
}

export default HomeScreen
