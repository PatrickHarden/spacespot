import React from 'react'
import moment from 'moment'
import 'moment/locale/es'
import 'moment/locale/nb'
import 'moment/locale/fi'
import 'moment/locale/de'
import {
  createIntl,
  createIntlCache,
  RawIntlProvider,
  IntlShape,
} from 'react-intl'
import messagesNo from './translations/no.json'
import messagesEn from './translations/en.json'
import messagesFi from './translations/fi.json'
import messagesDe from './translations/de.json'
import messagesEs from './translations/es.json'
import { useParams } from 'react-router-dom'
import history from 'browserhistory'

const configLocales: { [lang: string]: string } = {
  'spacespot.no': 'nb',
  'spacespot.fi': 'fi',
  'spacespot.de': 'de',
  'spacespot.es': 'es',
}

const domainDefaultCodes: { [lang: string]: string } = {
  '.com': 'en',
  '.fi': 'fi-fi',
  '.no': 'nb-no',
  '.de': 'de-de',
  '.es': 'es-es',
}

const defaultLangCodes: { [lang: string]: string } = {
  en: '/en',
  fi: '/fi-fi',
  nb: '/nb-no',
  de: '/de-de',
  es: '/es-es',
}

export const getRegionCode = () => {
  const key = Object.keys(configLocales).find(domain =>
    window.location.hostname.endsWith(domain),
  )
  return key ? configLocales[key] : 'en'
}

/**
 * Get user selected locale
 */
export const getUserLocale = () => {
  const lsLocale = localStorage.getItem('locale')
  if (lsLocale) {
    return lsLocale
  }
  const locale =
    Object.keys(configLocales).find(domain =>
      window.location.hostname.endsWith(domain),
    ) || navigator.language
  return locale
}

/**
 * Set user selected locale and save it in localStorage
 */
export const setUserLocale = (loc: string) => {
  const locale = loc ? loc : getUserLocale()
  moment.locale(locale)
  const lang = locale.split(/[-_]/)[0]
  localStorage.setItem('locale', locale)

  if (
    window.location.pathname.startsWith('/en/') ||
    window.location.pathname.startsWith('/nb-no/') ||
    window.location.pathname.startsWith('/fi-fi/') ||
    window.location.pathname.startsWith('/de-de/') ||
    window.location.pathname.startsWith('/es-es/')
  ) {
    const uri = window.location.pathname.startsWith('/en/')
      ? window.location.pathname.substring(4)
      : window.location.pathname.substring(7)
    history.push(`${defaultLangCodes[lang]}/${uri}`)
  }
  return [locale, lang]
}

moment.locale(getUserLocale())

/**
 * Get user selected language
 */
export const getUserLanguage = () => {
  const locale = getUserLocale()
  return locale.split(/[-_]/)[0]
}

/**
 * Get context language
 *
 * Get the language from the current URL.
 * if not present, returns the user language
 */
export const getLang = () => {
  if (window.location.pathname.startsWith('/en')) {
    return 'en'
  } else if (window.location.pathname.startsWith('/nb-no')) {
    return 'nb'
  } else if (window.location.pathname.startsWith('/fi-fi')) {
    return 'fi'
  } else if (window.location.pathname.startsWith('/de-de')) {
    return 'de'
  } else if (window.location.pathname.startsWith('/es-es')) {
    return 'es'
  }
  return getUserLanguage()
}

/**
 * Get URI language prefix: e.g /en/
 */
export const getLangPrefix = () => {
  if (window.location.pathname.startsWith('/en/')) {
    return '/en'
  } else if (window.location.pathname.startsWith('/nb-no/')) {
    return '/nb-no'
  } else if (window.location.pathname.startsWith('/fi-fi/')) {
    return '/fi-fi'
  } else if (window.location.pathname.startsWith('/de-de/')) {
    return '/de-de'
  } else if (window.location.pathname.startsWith('/de-de/')) {
    return '/es-es'
  }

  const language = getUserLanguage()
  if (language === 'fi') {
    return `/${language}-fi`
  } else if (language === 'en' || language === 'nb') {
    return `/${language}-no`
  } else if (language === 'fi') {
    return `/${language}-fi`
  } else if (language === 'de') {
    return `/${language}-de`
  } else if (language === 'es') {
    return `/${language}-es`
  } else {
    return `/en`
  }
}

export const routingLang = (routes: { [lang: string]: string }) => {
  const lng = getLang()
  return routes[lng] || routes['default'] || '/'
}

const intlEN = createIntl(
  {
    locale: 'en',
    messages: messagesEn,
  },
  createIntlCache(),
)

const intlNB = createIntl(
  {
    locale: 'nb',
    messages: messagesNo,
  },
  createIntlCache(),
)

const intlFI = createIntl(
  {
    locale: 'fi',
    messages: messagesFi,
  },
  createIntlCache(),
)

const intlDE = createIntl(
  {
    locale: 'de',
    messages: messagesDe,
  },
  createIntlCache(),
)

const intlES = createIntl(
  {
    locale: 'es',
    messages: messagesEs,
  },
  createIntlCache(),
)

const intls: { [lang: string]: IntlShape } = {
  en: intlEN,
  nb: intlNB,
  fi: intlFI,
  de: intlDE,
  es: intlES,
}

export const getUserIntl = () => {
  const lang = getUserLanguage()
  return intls[lang] || intlEN
}

export function withLang<T>(lang: string, Component: React.ComponentType<T>) {
  const sintl = intls[lang] || intlEN
  const Comp = (props: T) => {
    return (
      <RawIntlProvider value={sintl}>
        <Component {...props} />
      </RawIntlProvider>
    )
  }
  return Comp
}

export function withPrefix<T>(Component: React.ComponentType<T>) {
  const Comp = (props: T) => {
    const { prefix } = useParams()
    //const lng = prefix === 'nb-no' ? 'nb' : 'en'
    const lang = getLangCodeFromLocale(prefix)
    const sintl = intls[lang] || intlEN
    return (
      <RawIntlProvider value={sintl}>
        <Component {...props} />
      </RawIntlProvider>
    )
  }
  return Comp
}

export const getDefaultLocaleCode = () => {
  const defaultLocaleCode = Object.keys(domainDefaultCodes).find(domain =>
    window.location.hostname.endsWith(domain),
  )
  return defaultLocaleCode ? domainDefaultCodes[defaultLocaleCode] : 'en'
}

/**
 * This is common method to return locale based on lang code
 */
export const getLocaleFromLangCode = (localeStr: string) => {
  if (localeStr === 'nb') {
    return 'nb-no'
  } else if (localeStr === 'fi') {
    return 'fi-fi'
  } else if (localeStr === 'de') {
    return 'de-de'
  } else if (localeStr === 'es') {
    return 'es-es'
  } else if (localeStr === 'en') {
    return 'en'
  } else {
    return getDefaultLocaleCode()
  }
}

/**
 * This is common method to return locale based on lang code
 */
export const getLangCodeFromLocale = (langCdStr: any) => {
  if (langCdStr === 'nb-no') {
    return 'nb'
  } else if (langCdStr === 'fi-fi') {
    return 'fi'
  } else if (langCdStr === 'de-de') {
    return 'de'
  } else if (langCdStr === 'es-es') {
    return 'es'
  } else {
    return 'en'
  }
}
