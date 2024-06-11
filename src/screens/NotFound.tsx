import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

import OnBoardingLayout from '../components/OnBoardingLayout'
import Heading1 from 'components/common/Heading1'
import marked from 'marked'

const Content = styled.div`
  min-height: calc(100vh - 232px);
  text-align: center;
  @media (min-width: 1064px) {
    margin: 0 auto;
    padding: 0 20px;
    width: 1024px;
  }
  @media (min-width: 768px) and (max-width: 1063px) {
    margin: 0;
    padding: 0 20px;
  }
  @media (max-width: 767px) {
    margin: 0;
    padding: 0 10px;
  }
`

const Hero = styled.p`
  font-size: 28px;
  opacity: 0.75;
  color: #d75a4a;
  font-size: 150px;
  font-weight: 400;
  letter-spacing: -1.88px;
  line-height: 192px;
  margin: 80px auto 0;
`

const H1 = styled(Heading1)`
  color: #000000;
  margin-top: 0px;
  margin-bottom: 82px;
`

const Msg = styled.div`
  p {
    color: #000000;
    font-size: 20px;
    font-weight: 400;
    letter-spacing: -0.25px;
    line-height: 26px;
    margin: 0 auto 21px;
  }
  a {
    text-decoration: none;
    color: #0081a2;
  }
`

const NotFound = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const text = marked(t('E404_TEXT'))

  return (
    <>
      <Helmet>
        <title>{t('SEO_TITLE_404')}</title>
      </Helmet>
      <OnBoardingLayout hasFooter={true}>
        <Content>
          <Hero>404</Hero>
          <H1>{t('E404_H1')}</H1>
          <Msg
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
        </Content>
      </OnBoardingLayout>
    </>
  )
}

export default NotFound
