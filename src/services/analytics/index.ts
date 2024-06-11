import ReactGA from 'react-ga'
import axios from 'axios'

import config from 'config'
import history from 'browserhistory'
import { loadPixelAPI } from './loadpixel'
export { usePixel } from './hooks'

let ready = false

const init = () => {
  const consent = localStorage.getItem('cookie-consent')
  if (!consent) return
  ReactGA.initialize(config.GOOGLE_TRACKING_CODE)
  ready = true
  // console.log('Analytics: init')

  // Initialize google analytics page view tracking
  history.listen(location => {
    // console.log('Analytics: pageView ', location.pathname)
    ReactGA.set({ page: location.pathname }) // Update the user's current page
    ReactGA.pageview(location.pathname) // Record a pageview for the given page
  })

  if (consent !== 'false') {
    loadPixelAPI()
  }
}

const event = (ev: any) => {
  if (!ready) return
  // console.log('Analytics: event', ev)
  ReactGA.event(ev)
}

/**
 * GTM dataLayer push
 *
 * see https://developers.google.com/tag-manager/devguide#events
 */
const gtmEvent = (ev: any) => {
  const win = (window as unknown) as any
  win.dataLayer && win.dataLayer.push(ev)
}

const pixel = (ct: string) => {
  const consent = localStorage.getItem('cookie-consent')

  if (!ready) return
  try {
    if (consent !== 'false') {
      axios.get(
        // Aded withCredentials to forward the token for Campaign
        //`https://insight.adsrvr.org/track/pxl/?adv=6gmmyim&ct=${ct}&fmt=3`,
        `https://insight.adsrvr.org/track/pxl/?adv=6gmmyim&ct=${ct}&fmt=3`, { withCredentials: true },
      )
    }
  } catch {
    // ignore pixel issues
  }
}

const PIXELS = {
  SEARCH: '0:ka4bzg6',
  SELECT_SPACE: '0:btb7pw8',
  SEND_ENQUIRY: '0:6ywcv06',
  SIGNUP: '0:6u9gs4z',
  ACCEPT_ENQUIRY: '0:9jr4h2a',
  NEGOTIATION_SUBMITTED: '0:pcdfo63',
  ACCEPT_LEASE: '0:2tge50w',
  SIGN: '0:bqnev20',
}

export default {
  init,
  event,
  gtmEvent,
  pixel,
  PIXELS,
}
