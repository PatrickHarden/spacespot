import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { SitecoreContext, dataApi } from '@sitecore-jss/sitecore-jss-react'
import { getLangCodeFromLocale } from 'intl'

import Layout from 'components/Sitecore/Layout'
import { componentFactory } from 'bootstrap/sitecore'
import SitecoreContextFactory from './SitecoreContextFactory'

import OnBoardingLayout from '../components/OnBoardingLayout'

const config = {
  sitecoreApiKey: '8EEB9E1E05074F39AEC7D596D8E4BD84',
  // sitecoreApiHost: 'http://localhost:3000',
  sitecoreApiHost: '',
  sitecorePagePath: '/sitecore/content/SpaceSpot/Shared-Sections/Pages',
}

const Content = styled.div`
  min-height: calc(100vh - 232px);
  @media (min-width: 1064px) {
    margin: 50px auto;
    padding: 0 20px;
    width: 1024px;
  }
  @media (min-width: 768px) and (max-width: 1063px) {
    margin: 50px 0;
    padding: 0 20px;
  }
  @media (max-width: 767px) {
    margin: 50px 0;
    padding: 0 10px;
  }
`

export function dataFetcher(url: string, data: any) {
  return axios({
    url,
    method: data ? 'POST' : 'GET',
    data,
    withCredentials: true,
  })
}

function getRouteData(route: string, language: string) {
  const fetchOptions = {
    layoutServiceConfig: { host: config.sitecoreApiHost },
    // eslint-disable-next-line @typescript-eslint/camelcase
    querystringParams: { sc_lang: language, sc_apikey: config.sitecoreApiKey },
    fetcher: dataFetcher,
  }

  return dataApi.fetchRouteData(route, fetchOptions).catch((error: any) => {
    if (
      error.response &&
      error.response.status === 404 &&
      error.response.data
    ) {
      return error.response.data
    }

    console.error('Route data fetch error', error, error.response)

    return null
  })
}

const Loading = () => <div>Loading</div>

const Sitecore = () => {
  const [routeData, setRouteData] = useState((null as unknown) as any)
  const { prefix, page } = useParams()
  //const lng = prefix === 'nb-no' ? 'nb' : 'en'
  const lng = getLangCodeFromLocale(prefix)
  const sitecorePATH = `${config.sitecorePagePath}/${page}`

  useEffect(() => {
    getRouteData(sitecorePATH, lng).then((routeData: any) => {
      if (
        routeData !== null &&
        routeData.sitecore &&
        routeData.sitecore.route
      ) {
        // set the sitecore context data and push the new route
        SitecoreContextFactory.setSitecoreContext({
          route: routeData.sitecore.route,
          itemId: routeData.sitecore.route.itemId,
          ...routeData.sitecore.context,
        })
        setRouteData(routeData)
      }
    })
  }, [lng, sitecorePATH])

  return (
    <SitecoreContext
      componentFactory={componentFactory}
      contextFactory={SitecoreContextFactory}>
      <OnBoardingLayout hasFooter={true}>
        <Content>
          {routeData ? (
            <Layout route={routeData.sitecore.route} />
          ) : (
            <Loading />
          )}
        </Content>
      </OnBoardingLayout>
    </SitecoreContext>
  )
}

export default Sitecore
