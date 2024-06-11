import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { useSignerInfo, useSigners } from 'services/negotiation/hooks'
import userSelectors from 'services/user/selectors'
import negotiationSelectors from 'services/negotiation/selectors'
import { NegotiationStatus } from 'services/negotiation/types'
import Spinner from 'components/icons/Spinner'
import mail from 'assets/icons/mail.svg'
import clock from 'assets/icons/clock.svg'
import check from 'assets/icons/check.svg'

const Title = styled.p`
  margin-bottom: 15px;
  color: #000000;
  font-size: 20px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`

const IconMsg = styled.div`
  display: flex;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
`

const IconCol = styled.div`
  flex: 0 0 40px;
  img {
    margin: 10px 0;
  }
`
const MsgCol = styled.div`
  p {
    margin: 10px 0;
    b {
      font-weight: 500;
    }
  }
`

const LeaseAccepted = styled((props: { className?: string }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { className } = props
  const signerInfo = useSignerInfo()
  const signers = useSigners()
  const isLandlord = useSelector(userSelectors.isLandlord)
  const userStatus = useSelector(negotiationSelectors.getNegotiationStatus)
  const peerStatus = useSelector(negotiationSelectors.getNegotiationPeerStatus)
  let userSigned = userStatus === NegotiationStatus.LeaseSigned
  let peerSigned = peerStatus === NegotiationStatus.LeaseSigned

  if (signers) {
    const landlord = signers.filter(d => d.signerType === 'Landlord')[0]
    const tenant = signers.filter(d => d.signerType === 'Tenant')[0]
    userSigned = (isLandlord ? landlord : tenant).signerStatus === 'completed'
    peerSigned = (isLandlord ? tenant : landlord).signerStatus === 'completed'
  }

  const title = t('SUMMARY_SIGNING_BOTH_ACCEPTED')

  const footer = peerSigned
    ? isLandlord
      ? t('SUMMARY_SIGNING_TENANT_SIGNED')
      : t('SUMMARY_SIGNING_LANDLORD_SIGNED')
    : isLandlord
    ? t('SUMMARY_SIGNING_TENANT_NOT_SIGNED')
    : t('SUMMARY_SIGNING_LANDLORD_NOT_SIGNED')

  const msgMail1 = t('SUMMARY_SIGNING_EMAIL_SENT_TO')
  const msgMail2 = t('SUMMARY_SIGNING_EMAIL_SENT_WITH')

  return (
    <div className={className}>
      <Title>{title}</Title>
      <IconMsg>
        <IconCol>
          <img width="20px" src={userSigned ? check : mail} alt="mail" />
        </IconCol>
        <MsgCol>
          {signerInfo ? (
            <p>
              {userSigned ? (
                t('SUMMARY_SIGNING_YOU_SIGNED')
              ) : (
                <>
                  <b>{`${msgMail1} ${signerInfo.emailId} `}</b>
                  {msgMail2}
                </>
              )}
            </p>
          ) : (
            <Spinner />
          )}
        </MsgCol>
      </IconMsg>
      <IconMsg>
        <IconCol>
          <img width="20px" src={peerSigned ? check : clock} alt="clock" />
        </IconCol>
        <MsgCol>
          <p>{footer}</p>
        </MsgCol>
      </IconMsg>
    </div>
  )
})`
  padding: 0 20px 40px 20px;
`

export default LeaseAccepted
