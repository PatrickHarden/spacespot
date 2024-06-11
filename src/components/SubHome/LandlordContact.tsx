import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import Header2 from 'components/common/Heading2'
import device from 'services/global/device'

import womanbg from 'assets/img/woman-using-mobile.png'

const H2 = styled(Header2)`
  color: black;
`

const Container = styled.div`
  position: relative;
  height: 360px;
  padding-top: 40px;
  img {
    position: absolute;
    top: 0;
    left: 0;
    @media ${device.lessThanIPad} {
      display: none;
    }
  }
  & > div {
    background-color: #fafafa;
  }
  & > div > div {
    margin: 0 0 0 364px;
    padding: 20px 15px;
    max-width: 920px;
    @media ${device.lessThanIPad} {
      margin: 0 auto;
      max-width: 320px;
    }
  }
  h2 {
    margin-top: 0;
  }
  h3 {
    font-size: 22px;
    font-weight: 400;
    line-height: 29px;
    margin: 20px 0;
  }
`

const FillLink = styled.a`
  display: inline-block;
  color: white;
  background-color: #404042;
  font-size: 14px;
  font-weight: 550;
  border-radius: 2px;
  cursor: pointer;
  text-transform: uppercase;
  padding: 8px 20px;
  text-decoration: none;
`

const LandlordContact = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  return (
    <Container data-auto="landlord-contact">
      <div>
        <div>
          <H2>{t('HOME_LANDLORD_TITLE')}</H2>
          <h3>{t('HOME_LANDLORD_TEXT')}</h3>
          <FillLink
            href={t('MARKETING_EMAIL_ID')}
            target="_blank"
            rel="noopener noreferrer">
            {t('HOME_CONTACT_ADVISOR')}
          </FillLink>
        </div>
      </div>
      <img src={womanbg} alt="womanbg" />
    </Container>
  )
}

export default LandlordContact
