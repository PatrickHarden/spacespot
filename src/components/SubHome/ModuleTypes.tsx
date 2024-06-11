import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import Header2 from 'components/common/Heading2'
import device from 'services/global/device'

import ModuleImgTextHorizontal from './ModuleImgTextHorizontal'
import Coworking2 from 'assets/img/coworking-2.jpg'
import Coworking3 from 'assets/img/coworking-3.jpg'
import Coworking4 from 'assets/img/coworking-4.jpg'

const ModuleContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 80px;
  @media ${device.mobile} {
    padding-bottom: 20px;
  }
`
const H2 = styled(Header2)`
  text-align: center;
  color: black;
  margin: 15px 0;
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
  line-height: 21px;
`
export const ModuleTypes = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <ModuleContainer data-auto="module-types">
      <H2>{t('SUBCOWORKING_MODULE2_TITLE')}</H2>
      <ModulleContents>
        <ModuleImgTextHorizontal
          img={Coworking2}
          title={t('SUBCOWORKING_MODULE2_1_TITLE')}>
          <Text> {t('SUBCOWORKING_MODULE2_1_TEXT')}</Text>
        </ModuleImgTextHorizontal>
        <ModuleImgTextHorizontal
          img={Coworking3}
          title={t('SUBCOWORKING_MODULE2_2_TITLE')}>
          <Text> {t('SUBCOWORKING_MODULE2_2_TEXT')}</Text>
        </ModuleImgTextHorizontal>
        <ModuleImgTextHorizontal
          img={Coworking4}
          title={t('SUBCOWORKING_MODULE2_3_TITLE')}>
          <Text> {t('SUBCOWORKING_MODULE2_3_TEXT')}</Text>
        </ModuleImgTextHorizontal>
      </ModulleContents>
    </ModuleContainer>
  )
}

export default ModuleTypes
