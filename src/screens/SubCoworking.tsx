import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'

import Header from 'components/MainLayout/Header'
import Wizard from 'components/Wizard'
import Coworking from 'components/SubHome/Coworking'
import Footer from 'components/MainLayout/Footer'
import device from 'services/global/device'
import bgL from 'assets/img/coworking-hero-img.jpg'
import CONFIG from 'config'
import { SearchType } from 'services/search/types'

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

export const SubCoworking = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <>
      <Helmet>
        <title>{t('SEO_TITLE_COWORKING')}</title>
        <meta name="description" content={t('SEO_DESCRIPTION_COWORKING')} />
        <link rel="canonical" href={`${CONFIG.CANONICAL_HOST}/`} />
      </Helmet>
      <Background>
        <BackgroundImage>
          <picture>
            <BGImg src={bgL} alt="bg" />
          </picture>
          <Container>
            <Header />
            <Wizard
              title={t('SUBCOWORKING_WIZARD_TITLE')}
              searchType={SearchType.Flex}
              data-testid="WizardScreenWizard"
            />
          </Container>
        </BackgroundImage>
        <BackgroundHome>
          <Coworking />
          <Footer />
        </BackgroundHome>
      </Background>
    </>
  )
}

export default SubCoworking
