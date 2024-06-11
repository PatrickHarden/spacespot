import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import marked from 'marked'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

import OnBoardingLayout from '../components/OnBoardingLayout'
import CONFIG from 'config'
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
  ol {
    list-style-type: none;
    counter-reset: item;
    margin: 0;
    padding: 0;
  }

  ol > li {
    display: table;
    counter-increment: item;
    margin-bottom: 0.6em;
  }

  ol > li:before {
    content: counters(item, '.') '. ';
    display: table-cell;
    padding-right: 0.6em;
  }

  li ol > li {
    margin: 0;
  }

  li ol > li:before {
    content: counters(item, '.') ' ';
  }
  strong {
    font-weight: 500;
  }
  > ol > li > p,
  > ol > li:before {
    color: #000000;
    font-size: 28px;
    font-weight: 400;
  }
  ol:nth-child(6) > li > p,
  ol:nth-child(6) > li:before {
    color: #000000;
    font-size: 16px;
    font-weight: 400;
  }
`

const TermsOfService = () => {
  const [text, setText] = useState('')
  const { locale, formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  useEffect(() => {
    const fetchData = async () => {
      const useLocale = ['en', 'no', 'fi'].includes(locale) ? locale : 'en'
      try {
        const file = await import(
          `services/markdown/terms-of-service-${useLocale}.md`
        )
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
        <title>{t('SEO_TITLE_TERMS')}</title>
        <meta name="description" content={t('SEO_DESCRIPTION_TERMS')} />
        <link
          rel="canonical"
          href={`${CONFIG.CANONICAL_HOST}${getLangPrefix()}terms`}
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

export default TermsOfService
