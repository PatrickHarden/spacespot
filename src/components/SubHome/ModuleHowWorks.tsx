import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import device from 'services/global/device'
import Header2 from 'components/common/Heading2'
import ModuleCountingText from './ModuleCountingText'

const ModuleContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  margin-bottom: 60px;
  padding-bottom: 60px;
  @media ${device.mobile} {
    padding-bottom: 0;
    margin-bottom: 30px;
  }
`
const H2 = styled(Header2)`
  text-align: center;
  padding-bottom: 50px;
  @media ${device.mobile} {
    padding-bottom: 10px;
    margin: 15px 0;
  }
`

const ModulleContents = styled.div`
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
  padding: 0 40px;
  text-align: justify;
`

export const ModuleHowWorks = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <ModuleContainer data-auto="module-how-works">
      <H2>{t('SUBCOWORKING_MODULE5_TITLE')}</H2>
      <ModulleContents>
        <ModuleCountingText
          number={1}
          title={t('SUBCOWORKING_MODULE5_1_TITLE')}>
          <Text> {t('SUBCOWORKING_MODULE5_1_TEXT')}</Text>
        </ModuleCountingText>
        <ModuleCountingText
          number={2}
          title={t('SUBCOWORKING_MODULE5_2_TITLE')}>
          <Text> {t('SUBCOWORKING_MODULE5_2_TEXT')}</Text>
        </ModuleCountingText>
        <ModuleCountingText
          number={3}
          title={t('SUBCOWORKING_MODULE5_3_TITLE')}>
          <Text> {t('SUBCOWORKING_MODULE5_3_TEXT')}</Text>
        </ModuleCountingText>
      </ModulleContents>
    </ModuleContainer>
  )
}

export default ModuleHowWorks
