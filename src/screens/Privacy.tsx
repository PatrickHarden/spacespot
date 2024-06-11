import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import marked from 'marked'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import CONFIG from 'config'

import OnBoardingLayout from '../components/OnBoardingLayout'
import { getLangPrefix } from 'intl'

const Content = styled.div`
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
  h1 {
    color: #404042;
    font-size: 40px;
    font-weight: 300;
  }
  h2 {
    color: #000000;
    font-size: 28px;
    font-weight: 400;
    padding-top: 50px;
  }
  h3 {
    color: #000000;
    font-size: 22px;
    font-weight: 400;
    line-height: 29px;
  }
  p {
    color: #000000;
    font-size: 16px;
    font-weight: 400;
  }
  strong {
    font-weight: 500;
  }
  a {
    text-decoration: none;
    color: #0081a2;
  }
  .table-scroll {
    overflow-x: auto;
    padding-bottom: 60px;
  }
  table {
    border: 1px solid #dddddd;
    border-spacing: 0;
    width: 100%;
  }
  thead {
    border-radius: 3px 3px 0 0;
    background-color: #ffffff;
    th {
      color: #000000;
      text-align: left;
      font-size: 16px;
      font-weight: 400;
      padding: 10px 10px 10px 30px;
    }
  }
  td {
    border-top: none;
    border-bottom: 1px solid #dddddd;
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
    padding: 30px;
    text-align: left;
    min-width: 150px;
    @media (max-width: 767px) {
      padding: 15px;
    }
    br {
      content: '';
      margin: 2em;
      display: block;
      font-size: 24%;
    }
  }
  td:first-child {
    border-right: none;
  }
  td:last-child {
    border-left: none;
  }
`
const Privacy = () => {
  const [text, setText] = useState('')
  const { locale, formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  useEffect(() => {
    const fetchData = async () => {
      const useLocale = ['en', 'no'].includes(locale) ? locale : 'en'
      try {
        const file = await import(`services/markdown/privacy-${useLocale}.md`)
        const response = await fetch(file.default)
        setText(await response.text())
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [locale])
  return (
    <>
      <Helmet>
        <title>{t('SEO_TITLE_PRIVACY')}</title>
        <meta name="description" content={t('SEO_DESCRIPTION_PRIVACY')} />
        <link
          rel="canonical"
          href={`${CONFIG.CANONICAL_HOST}${getLangPrefix()}/privacy`}
        />
      </Helmet>
      <OnBoardingLayout hasFooter={true}>
        <Content
          dangerouslySetInnerHTML={{
            __html: marked(text),
          }}
        />
      </OnBoardingLayout>
    </>
  )
}

export default Privacy
