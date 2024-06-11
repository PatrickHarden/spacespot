import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { get } from 'lodash'
import {
  Placeholder,
  VisitorIdentification,
} from '@sitecore-jss/sitecore-jss-react'

import Breadcrumb from 'components/SubHome/Breadcrumb'
import Header1 from 'components/common/Heading1'

const H1 = styled(Header1)`
  max-width: 1260px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 60px;
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

/*
  APP LAYOUT
  This is where the app's HTML structure and root placeholders should be defined.

  All routes share this root layout by default (this could be customized in RouteHandler),
  but components added to inner placeholders are route-specific.
*/

const Layout = (props: { route: any }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { route } = props
  console.log('props:', props)
  const placeholders = Object.keys(route.placeholders)
  if (placeholders.length < 1) {
    return <p>No placeholder</p>
  }
  const pageTitle = get(route, 'fields.Title.value', 'Page')
  return (
    <React.Fragment>
      <Helmet>
        <title>{pageTitle} </title>
      </Helmet>

      {/*
      VisitorIdentification is necessary for Sitecore Analytics to determine if the visitor is a robot.
      If Sitecore XP (with xConnect/xDB) is used, this is required or else analytics will not be collected for the JSS app.
      For XM (CMS-only) apps, this should be removed.

      VI detection only runs once for a given analytics ID, so this is not a recurring operation once cookies are established.
      */}
      <VisitorIdentification />

      {/* root placeholder for the app, which we add components to using route data */}
      <Container>
        <Breadcrumb>
          <Link to="/">{t('BREADCRUMB_HOME')}</Link>
          &gt;
          <span>{pageTitle}</span>
        </Breadcrumb>
        <H1>{pageTitle}</H1>
        <Placeholder name={placeholders[0]} rendering={route} />
      </Container>
    </React.Fragment>
  )
}

export default Layout
