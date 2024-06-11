import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import marked from 'marked'
import { useLocation } from 'react-router-dom'
import device from 'services/global/device'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import styled from 'styled-components'

import FilledButton from 'components/common/FilledButton'
import OutlinedButton from 'components/common/OutlinedButton'
import cookie from 'assets/icons/cookie.svg'
import Analytics from 'services/analytics'

const DialogActionsFrame = styled.div`
  padding: 30px 22px;
  @media ${device.mobile} {
    width: 100%;
  }
`

const CookieDialogContent = styled(DialogContent)`
  padding: 0 30px;
`
const DialogBody = styled.div`
  p {
    color: black;
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    max-width: 500px;
  }
  a {
    text-decoration: none;
    color: #4fbbd8;
  }
`
const CookieDialogTitle = styled(DialogTitle)`
  text-align: left;
  padding: 30px;
  h2 {
    display: flex;
    color: #000000;
    font-size: 28px;
    font-weight: 400;
    letter-spacing: -0.25px;
    line-height: 35px;
    img {
      margin-right: 10px;
    }
  }
`

const ButtonEnabled = styled(FilledButton)`
  background: #f35c2b;
  outline: none;
  @media ${device.mobile} {
    width: 100%;
  }
`

const ReqCookiesBtn = styled(OutlinedButton)`
  margin-right: 10px;
  color: #404042;
  outline: none;
  border: none;

  @media ${device.mobile} {
    margin-right: 0px;
    margin-bottom: 15px;
    width: 100%;
  }
`

/**
 * Cookie Dialog
 */
const CookieDialog = () => {
  const { pathname } = useLocation()
  const enable = !pathname.includes('/cookie-policy')
  const consent = localStorage.getItem('cookie-consent')
  const validAgent = navigator.userAgent !== 'ReactSnap'
  const [text, setText] = useState('')
  const [open, setOpen] = useState(consent === null && validAgent)
  const { locale, formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  useEffect(() => {
    const fetchData = async () => {
      const useLocale = ['en', 'nb', 'fi'].includes(locale) ? locale : 'en'
      try {
        const file = await import(`services/markdown/cookies-${useLocale}.md`)
        const response = await fetch(file.default)
        // FIXME if user changes URL quickly the component is unmonted and the
        // next update fails => remove dynamic import
        setText(await response.text())
      } catch (err) {
        // dynamic imports do not work in node / jest
      }
    }
    fetchData()
  }, [locale])

  const title = t('COOKIE_TITLE')
  const okText = t('COOKIE_ACCEPT')
  const reqCookiesOnly = t('COOKIE_REQUIRED')

  const close = () => {
    // do not close
    return
  }

  const click = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    localStorage.setItem('cookie-consent', 'true')
    Analytics.init()
    setOpen(false)
  }

  const reqCookiesClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    localStorage.setItem('cookie-consent', 'false')
    Analytics.init()
    setOpen(false)
  }

  return (
    <Dialog onClose={close} open={open && enable}>
      <CookieDialogTitle>
        <img src={cookie} alt="cookie" />
        {title}
      </CookieDialogTitle>
      <CookieDialogContent>
        <DialogBody
          dangerouslySetInnerHTML={{
            __html: marked(text),
          }}
        />
      </CookieDialogContent>
      <DialogActions>
        <DialogActionsFrame>
          <ReqCookiesBtn onClick={reqCookiesClick}>
            {reqCookiesOnly}
          </ReqCookiesBtn>
          <ButtonEnabled
            id="cookieDialogOK"
            color="primary"
            autoFocus
            onClick={click}>
            {okText}
          </ButtonEnabled>
        </DialogActionsFrame>
      </DialogActions>
    </Dialog>
  )
}

export default CookieDialog
