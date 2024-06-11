import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import Header1 from 'components/common/Heading1'
import Header2 from 'components/common/Heading2'
import OutlinedButton from 'components/common/OutlinedButton'

import ModuleTextImg from './ModuleTextImg'
import ModuleHowWorks from './ModuleHowWorks'
import LandlordContact from './LandlordContact'
import Highlighted from './Highlighted'
import Breadcrumb from './Breadcrumb'

import check from 'assets/icons/check.svg'

import img1 from 'assets/img/office-1.jpg'
import img2 from 'assets/img/office-2.jpg'
import Coworking6 from 'assets/img/coworking-6.jpg'

import device from 'services/global/device'
import ButtonSearch from './ButtonSearch'
import { SearchType } from 'services/search/types'
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

export const Offices = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <>
      <Container>
        <Breadcrumb>
          <Link to="/">{t('BREADCRUMB_HOME')}</Link>
          &gt;
          <span>{t('BREADCRUMB_SUBOFFICE')}</span>
        </Breadcrumb>
        <H1>{t('SUBOFFICE_TITLE')}</H1>

        <ModuleTextImg title={t('SUBOFFICE_MODULE1_TITLE')} img={img1}>
          <ModuleTextImgTextContainer data-auto="offices-1">
            <Text>{t('SUBOFFICE_MODULE1_TEXT1')}</Text>
            <Text>{t('SUBOFFICE_MODULE1_TEXT2')}</Text>
            <Text>{t('SUBOFFICE_MODULE1_TEXT3')}</Text>
            <ul>
              <List>{t('SUBOFFICE_MODULE1_LIST1')}</List>
              <List>{t('SUBOFFICE_MODULE1_LIST2')}</List>
              <List>{t('SUBOFFICE_MODULE1_LIST3')}</List>
              <List>{t('SUBOFFICE_MODULE1_LIST4')}</List>
            </ul>
          </ModuleTextImgTextContainer>
        </ModuleTextImg>
        <ModuleTextImg
          isImageFirst={true}
          title={t('SUBOFFICE_MODULE2_TITLE')}
          img={img2}>
          <ModuleTextImgTextContainerRight data-auto="offices-2">
            <Text>{t('SUBOFFICE_MODULE2_TEXT')}</Text>
            <Link
              to={routingLang({
                nb: '/nb-no/coworking',
                fi: '/fi-fi/coworking',
                de: '/de-de/coworking',
                es: '/es-es/coworking',
                default: '/en/coworking',
              })}>
              <OutlinedButtonGrey>
                {t('SUBOFFICE_MODULE2_BUTTON')}
              </OutlinedButtonGrey>
            </Link>
          </ModuleTextImgTextContainerRight>
        </ModuleTextImg>
        <ModuleTextImg title={t('SUBCOWORKING_MODULE4_TITLE')} img={Coworking6}>
          <ModuleTextImgTextContainer data-auto="offices-3">
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
        <CH2>{t('SUBOFFICE_HIGHLIGHTED')}</CH2>
        <Highlighted usageType={'Office'} />
        <CRow>
          <ButtonSearch
            title={t('SUBOFFICE_ALL_CTA')}
            searchType={SearchType.Fixed}
          />
        </CRow>
      </Container>
      <LandlordContact />
    </>
  )
}

export default Offices
