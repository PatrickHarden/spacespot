import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import Header1 from 'components/common/Heading1'

import Mission from 'assets/img/about-us-mission.jpg'
import device from 'services/global/device'

import ModuleTextImg from './ModuleTextImg'
import ModuleSSDifferent from './ModuleSSDifferent'
import Breadcrumb from './Breadcrumb'
import ModuleHowHelps from './ModuleHowHelps'

const H1 = styled(Header1)`
  max-width: 1260px;
  margin: 0 auto;
  padding-bottom: 60px;
  @media ${device.mobile} {
    font-size: 28px;
    font-weight: 400;
    padding-bottom: 20px;
  }
`

const Container = styled.div`
  max-width: 1260px;
  margin: 0 auto 50px;
  padding: 0 40px 40px 40px;

  @media ${device.mobile} {
    padding: 0 20px 20px;
  }
`

const Text = styled.div`
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 21px;
`

const ModuleTextImgTextContainer = styled.div`
  padding: 0 30px 0 0;
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  ul {
    padding: 0 15px;
  }
`

export const AboutUs = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <Container>
      <Breadcrumb>
        <Link to="/">{t('BREADCRUMB_HOME')}</Link>
        &gt;
        <span>{t('BREADCRUMB_ABOUTUS')}</span>
      </Breadcrumb>
      <H1>{t('ABOUTUS_TITLE')}</H1>

      <ModuleTextImg title={t('ABOUTUS_MODULE1_TITLE')} img={Mission}>
        <ModuleTextImgTextContainer>
          <Text>{t('ABOUTUS_MODULE1_TEXT1')}</Text>
          <Text>{t('ABOUTUS_MODULE1_TEXT2')}</Text>
          <Text>{t('ABOUTUS_MODULE1_TEXT3')}</Text>
          <Text>{t('ABOUTUS_MODULE1_TEXT4')}</Text>
        </ModuleTextImgTextContainer>
      </ModuleTextImg>
      <ModuleSSDifferent />
      <ModuleHowHelps />
    </Container>
  )
}

export default AboutUs
