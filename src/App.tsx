import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { withLang, withPrefix, getDefaultLocaleCode } from 'intl'

import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles'

import EnquiryRoomScreen from 'screens/EnquiryRoom'
import OnBoardingScreen from 'screens/OnBoarding'
import Dashboard from 'screens/Dashboard'
import Tooling from 'screens/Tooling'
import TermsOfService from 'screens/TermsOfService'
import Privacy from 'screens/Privacy'
import PropertyListings from 'screens/PropertyListings'
import PropertyDetails from 'screens/PropertyDetails'
import Enquiries from 'screens/Enquiries'
import Home from 'screens/HomeScreen'
import SubOffices from 'screens/SubOffices'
import SubCoworking from 'screens/SubCoworking'
import NotFound from 'screens/NotFound'
import AboutUs from 'screens/AboutUs'
import Sitecore from 'screens/Sitecore'

import { actions as userActions } from 'services/user'

import Spinner from 'components/icons/Spinner'
import selectors from 'services/user/selectors'
import { SpacespotState } from 'services/global/types'
import ScrollToTop from 'components/MainLayout/ScrollToTop'
import history from './browserhistory'
import { MUITheme } from 'components/themes/default'
import CookiePolicy from 'screens/CookiePolicy'

export function when<T>(
  selector: (state: SpacespotState) => boolean,
  Component: React.ComponentType<T>,
  redirect: string,
) {
  const Comp = (props: T) => {
    const condition = useSelector(selector)
    return condition ? <Component {...props} /> : <Redirect to={redirect} />
  }
  return Comp
}

const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`

const App: React.FC = () => {
  const authLoading = useSelector(selectors.isLoading)
  const dispatch = useDispatch()
  const lang = useSelector(selectors.getLanguage)
  const disableJSS = navigator.userAgent === 'ReactSnap'

  useEffect(() => {
    dispatch(userActions.authInit())
  }, [dispatch])

  return (
    <StylesProvider injectFirst disableGeneration={disableJSS}>
      <MuiThemeProvider theme={MUITheme}>
        <ThemeProvider theme={MUITheme}>
          {authLoading ? (
            <SpinnerContainer>
              {/* Just in case MSAL is not working */}
              <p>Authenticating...</p>
              <Spinner />
            </SpinnerContainer>
          ) : (
            <Router history={history}>
              <ScrollToTop>
                <Switch>
                  {/* private routes first */}
                  <Route
                    path="/enquiry/:enquiryId"
                    component={when(
                      selectors.isLogged,
                      withLang(lang, EnquiryRoomScreen),
                      '/',
                    )}
                  />
                  <Route
                    path="/onboarding"
                    component={when(
                      selectors.isLandlord,
                      withLang(lang, OnBoardingScreen),
                      '/',
                    )}
                  />
                  <Route
                    path="/dashboard"
                    component={when(
                      selectors.isLandlord,
                      withLang(lang, Dashboard),
                      '/',
                    )}
                  />
                  <Route
                    path="/tooling"
                    component={when(
                      selectors.isLandlord,
                      withLang(lang, Tooling),
                      '/',
                    )}
                  />
                  <Route
                    path="/enquiries"
                    component={when(
                      selectors.isLogged,
                      withLang(lang, Enquiries),
                      '/',
                    )}
                  />
                  <Route
                    path="/terms"
                    component={withLang('en', TermsOfService)}
                  />
                  <Route path="/privacy" component={withLang('en', Privacy)} />
                  <Route
                    path="/:prefix/kontor"
                    component={withPrefix(SubOffices)}
                  />
                  <Route
                    path="/:prefix/toimitila"
                    component={withPrefix(SubOffices)}
                  />
                  <Route
                    path="/:prefix/büroräumen"
                    component={withPrefix(SubOffices)}
                  />
                  <Route
                    path="/:prefix/espacios-oficinas"
                    component={withPrefix(SubOffices)}
                  />
                  <Route
                    path="/:prefix/office-space"
                    component={withPrefix(SubOffices)}
                  />
                  <Route
                    path="/:prefix/coworking"
                    component={withPrefix(SubCoworking)}
                  />
                  <Route
                    path="/:prefix/about-us"
                    component={withPrefix(AboutUs)}
                  />
                  <Route
                    path="/:prefix/om-oss"
                    component={withPrefix(AboutUs)}
                  />
                  <Route
                    path="/:prefix/meistä"
                    component={withPrefix(AboutUs)}
                  />
                  <Route
                    path="/:prefix/ueber-uns"
                    component={withPrefix(AboutUs)}
                  />
                  <Route
                    path="/:prefix/sobre-nosotros"
                    component={withPrefix(AboutUs)}
                  />
                  <Route
                    path="/:prefix/list"
                    component={withPrefix(PropertyListings)}
                  />
                  <Route
                    path="/:prefix/detail/:stype/:city/:district/:subdistrict/:spaceId/:address"
                    component={withPrefix(PropertyDetails)}
                  />
                  <Route
                    path="/:prefix/terms"
                    component={withPrefix(TermsOfService)}
                  />
                  <Route
                    path="/:prefix/privacy"
                    component={withPrefix(Privacy)}
                  />
                  <Route
                    path="/:prefix/cookie-policy"
                    component={withPrefix(CookiePolicy)}
                  />
                  <Route
                    path="/:prefix/cms/:page"
                    component={withPrefix(Sitecore)}
                  />
                  <Route path="/:prefix/404" component={withPrefix(NotFound)} />
                  <Route exact path="/en/" component={withLang('en', Home)} />
                  <Route
                    exact
                    path="/nb-no/"
                    component={withLang('nb', Home)}
                  />
                  <Route
                    exact
                    path="/fi-fi/"
                    component={withLang('fi', Home)}
                  />
                  <Route
                    exact
                    path="/de-de/"
                    component={withLang('de', Home)}
                  />
                  <Route
                    exact
                    path="/es-es/"
                    component={withLang('es', Home)}
                  />
                  <Route exact path="/">
                    <Redirect to={`/${getDefaultLocaleCode()}/`} />
                  </Route>
                  {/* Default */}
                  {/* <Redirect to={`${getLangPrefix()}/404`} /> */}
                  <Route component={withLang(lang, NotFound)} />
                </Switch>
              </ScrollToTop>
            </Router>
          )}
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  )
}
export default App
