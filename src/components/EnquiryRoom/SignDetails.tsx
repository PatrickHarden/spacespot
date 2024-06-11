import React from 'react'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import Heading4 from 'components/common/Heading4'
import FilledButton from 'components/common/FilledButton'
import OutlinedButton from 'components/common/OutlinedButton'

import actions from 'services/negotiation/actions'
import { useSignerInfo } from 'services/negotiation/hooks'
import { NegotiationStatus } from 'services/negotiation/types'
import Spinner from 'components/icons/Spinner'

const Buttons = styled(
  (props: { className?: string; onNext: () => void; onBack: () => void }) => {
    const { className, onNext, onBack } = props
    const { formatMessage } = useIntl()
    const t = (s: string) => formatMessage({ id: s })
    return (
      <div className={className}>
        <FilledButton onClick={onNext}>
          {t('SUMMARY_CTA_ACCEPT_LEASE')}
        </FilledButton>
        <OutlinedButton onClick={onBack}>
          {t('SUMMARY_CTA_BACK')}
        </OutlinedButton>
      </div>
    )
  },
)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
  ${FilledButton} {
    width: 100%;
    background: #f35c2b;
    margin-bottom: 5px;
  }
  ${OutlinedButton} {
    width: 100%;
    border: none;
    color: #404042;
    text-transform: none;
  }
`
const Box = styled.div`
  padding: 10px 20px;
  border: 1px solid #dddddd;
  ${OutlinedButton} {
    border: none;
    padding: 0;
    text-transform: none;
  }
`

const Title = styled.p`
  color: #404042;
  margin-bottom: 5px;
`

const Name = styled(Heading4)`
  margin: 0;
  font-size: 16px;
`
const Email = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 20px;
`
const Company = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  color: #6d6c6c;
`
const Msg = styled(Heading4)`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dddddd;
  font-size: 16px;
`

const SignDetails = styled((props: { className?: string }) => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { className } = props
  const signerInfo = useSignerInfo()

  const next = () => {
    dispatch(actions.acceptLease())
  }

  const back = () => {
    dispatch(actions.putNegotiationStatus(NegotiationStatus.PreviewStart))
  }

  const edit = () => {
    dispatch(actions.putNegotiationStatus(NegotiationStatus.SignInfo))
  }

  return (
    <div className={className}>
      <Title>{t('SUMMARY_SIGNING_DETAILS_TITLE')}</Title>
      <Box>
        {signerInfo ? (
          <>
            <Name>{signerInfo.name}</Name>
            <Email>{signerInfo.emailId}</Email>
            <Company>{`${signerInfo.companyName} - ${signerInfo.companyNumber}`}</Company>
            <OutlinedButton onClick={edit}>
              {t('SUMMARY_CTA_CHANGE')}
            </OutlinedButton>
          </>
        ) : (
          <Spinner />
        )}
      </Box>
      <Msg>{t('SUMMARY_SIGNING_DETAILS_MSG')}</Msg>
      <Buttons onNext={next} onBack={back} />
    </div>
  )
})`
  margin: 0 20px;
`

export default SignDetails
