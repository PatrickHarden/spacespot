import React from 'react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import OutlinedButton from 'components/common/OutlinedButton'
import negActions from 'services/negotiation/actions'

const SignFooter = styled((props: { className?: string }) => {
  const { className } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  return (
    <div className={className}>
      <p>{t('SUMMARY_SIGNING_INFO')}</p>
      <OutlinedButton onClick={() => dispatch(negActions.getPreviewLease())}>
        {t('SUMMARY_PREVIEW_CTA_PREVIEW')}
      </OutlinedButton>
    </div>
  )
})`
  display: flex;
  flex-direction: column;
  background: #fafafa;
  align-items: center;
  padding-bottom: 20px;
  p {
    color: #6d6c6c;
    margin: 16px;
  }
  ${OutlinedButton} {
    border: none;
    background: #fafafa;
  }
`

export default SignFooter
