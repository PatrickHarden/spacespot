import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'

import Header from 'components/MainLayout/Header'
import AboutUsComp from 'components/SubHome/AboutUs'
import Footer from 'components/MainLayout/Footer'
import device from 'services/global/device'
import bgL from 'assets/img/about-us-hero-img.jpg'

import CONFIG from 'config'

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  max-height: 550px;
  @media ${device.mobile} {
    height: 42%;
  }
`

const BackgroundHome = styled.div`
  background: white;
  width: 100%;
  position: absolute;
  top: 550px;
  @media ${device.mobile} {
    top: 100%;
    top: 42%;
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

export const AboutUs = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <>
      <Helmet>
        <title>{t('SEO_TITLE_ABOUTUS')}</title>
        <meta name="description" content={t('SEO_DESCRIPTION_ABOUTUS')} />
        <link rel="canonical" href={`${CONFIG.CANONICAL_HOST}/`} />
      </Helmet>
      <BackgroundImage>
        <BGImg src={bgL} alt="bg" />
        <Container>
          <Header />
        </Container>
      </BackgroundImage>
      <BackgroundHome>
        <AboutUsComp />
        <Footer />
      </BackgroundHome>
    </>
  )
}

export default AboutUs
