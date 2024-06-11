import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import Header2 from 'components/common/Heading2'
import device from 'services/global/device'

const ModuleContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  margin-bottom: 60px;
  padding-bottom: 60px;
  @media ${device.mobile} {
    margin-bottom: 30px;
    padding-bottom: 0;
  }
`
const H2 = styled(Header2)`
  text-align: left;
  padding-bottom: 50px;
  @media ${device.mobile} {
    padding: 0 0 20px 0;
  }
`

const ModuleContents = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1280px;
`
const Text = styled.div`
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  padding: 0 15px;
  text-align: justify;
  @media ${device.mobile} {
    padding: 0;
  }
`
const Title = styled.div`
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  padding: 0 15px 30px 15px;
  min-height: 40px;
  @media ${device.mobile} {
    padding: 0 0 20px 0;
    min-height: inherit;
  }
`
const ModuleTitleTextContainer = styled.div`
  width: 25%;
  margin: 0 auto;
  padding-bottom: 20px;

  @media ${device.mobile} {
    width: 100%;
  }
`
const ModuleTitleText = (props: {
  title: string
  children: React.ReactNode
}) => {
  const { title, children } = props
  return (
    <ModuleTitleTextContainer>
      <Title>{title}</Title>
      {children}
    </ModuleTitleTextContainer>
  )
}

export const ModuleSSDifferent = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <ModuleContainer>
      <H2>{t('ABOUTUS_MODULE2_TITLE')}</H2>
      <ModuleContents>
        <ModuleTitleText title={t('ABOUTUS_MODULE2_1_TITLE')}>
          <Text> {t('ABOUTUS_MODULE2_1_TEXT')}</Text>
        </ModuleTitleText>
        <ModuleTitleText title={t('ABOUTUS_MODULE2_2_TITLE')}>
          <Text> {t('ABOUTUS_MODULE2_2_TEXT')}</Text>
        </ModuleTitleText>
        <ModuleTitleText title={t('ABOUTUS_MODULE2_3_TITLE')}>
          <Text> {t('ABOUTUS_MODULE2_3_TEXT')}</Text>
        </ModuleTitleText>
        <ModuleTitleText title={t('ABOUTUS_MODULE2_4_TITLE')}>
          <Text> {t('ABOUTUS_MODULE2_4_TEXT')}</Text>
        </ModuleTitleText>
      </ModuleContents>
    </ModuleContainer>
  )
}

export default ModuleSSDifferent
