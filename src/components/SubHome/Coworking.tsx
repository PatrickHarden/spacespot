import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import Header1 from 'components/common/Heading1'
import Header2 from 'components/common/Heading2'
import OutlinedButton from 'components/common/OutlinedButton'

import ModuleTextImg from './ModuleTextImg'
import ModuleTypes from './ModuleTypes'
import ModuleHowWorks from './ModuleHowWorks'
import LandlordContact from './LandlordContact'
import Highlighted from './Highlighted'
import Breadcrumb from './Breadcrumb'

import check from 'assets/icons/check.svg'

import Coworking1 from 'assets/img/coworking-1.jpg'
import Coworking5 from 'assets/img/coworking-5.jpg'
import Coworking6 from 'assets/img/coworking-6.jpg'

import device from 'services/global/device'
import { SearchType } from 'services/search/types'
import ButtonSearch from './ButtonSearch'
import { routingLang } from 'intl'

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

const CH2 = styled(Header2)`
  color: black;
  text-align: center;
  margin-top: 0;
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
const List = styled.li`
  list-style-image: url(${check});
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
const ModuleTextImgTextContainerRight = styled(ModuleTextImgTextContainer)`
  padding: 0 0 0 30px;
  @media ${device.mobile} {
    padding: 0;
  }
`
const OutlinedButtonGrey = styled(OutlinedButton)`
  color: #404042;
  border-color: #404042;
  margin-top: 35px;
`

const CRow = styled.div`
  margin-top: 30px;
  text-align: center;
`

export const Coworking = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <>
      <Container>
        <Breadcrumb>
          <Link to="/">{t('BREADCRUMB_HOME')}</Link>
          &gt;
          <span>{t('BREADCRUMB_SUBCOWORKING')}</span>
        </Breadcrumb>
        <H1>{t('SUBCOWORKING_TITLE')}</H1>

        <ModuleTextImg title={t('SUBCOWORKING_MODULE1_TITLE')} img={Coworking1}>
          <ModuleTextImgTextContainer data-auto="coworking-1">
            <Text>{t('SUBCOWORKING_MODULE1_TEXT1')}</Text>
            <Text>{t('SUBCOWORKING_MODULE1_TEXT2')}</Text>
            <Text>{t('SUBCOWORKING_MODULE1_TEXT3')}</Text>
            <ul>
              <List>{t('SUBCOWORKING_MODULE1_LIST1')}</List>
              <List>{t('SUBCOWORKING_MODULE1_LIST2')}</List>
              <List>{t('SUBCOWORKING_MODULE1_LIST3')}</List>
              <List>{t('SUBCOWORKING_MODULE1_LIST4')}</List>
            </ul>
          </ModuleTextImgTextContainer>
        </ModuleTextImg>
        <ModuleTypes />
        <ModuleTextImg
          isImageFirst={true}
          title={t('SUBCOWORKING_MODULE3_TITLE')}
          img={Coworking5}>
          <ModuleTextImgTextContainerRight data-auto="coworking-3">
            <Text>{t('SUBCOWORKING_MODULE3_TEXT')}</Text>
            <Link
              to={routingLang({
                nb: '/nb-no/kontor',
                fi: '/fi-fi/toimitila',
                de: '/de-de/büroräumen',
                es: '/es-es/espacios-oficinas',
                default: '/en/office-space',
              })}>
              <OutlinedButtonGrey>
                {t('SUBCOWORKING_MODULE3_BUTTON')}
              </OutlinedButtonGrey>
            </Link>
          </ModuleTextImgTextContainerRight>
        </ModuleTextImg>
        <ModuleTextImg title={t('SUBCOWORKING_MODULE4_TITLE')} img={Coworking6}>
          <ModuleTextImgTextContainer data-auto="coworking-4">
            <Text>{t('SUBCOWORKING_MODULE4_TEXT1')}</Text>
            <Text>{t('SUBCOWORKING_MODULE4_TEXT2')}</Text>
            <ul>
              <List>{t('SUBCOWORKING_MODULE4_LIST1')}</List>
              <List>{t('SUBCOWORKING_MODULE4_LIST2')}</List>
              <List>{t('SUBCOWORKING_MODULE4_LIST3')}</List>
              <List>{t('SUBCOWORKING_MODULE4_LIST4')}</List>
              <List>{t('SUBCOWORKING_MODULE4_LIST5')}</List>
            </ul>
          </ModuleTextImgTextContainer>
        </ModuleTextImg>
        <ModuleHowWorks />
        <CH2>{t('SUBCOWORKING_HIGHLIGHTED')}</CH2>
        <Highlighted usageType={'FlexOffice'} />
        <CRow>
          <ButtonSearch
            title={t('SUBCOWORKING_ALL_CTA')}
            searchType={SearchType.Flex}
          />
        </CRow>
      </Container>
      <LandlordContact />
    </>
  )
}

export default Coworking
