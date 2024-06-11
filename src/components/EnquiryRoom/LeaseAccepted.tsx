import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { useSignerInfo } from 'services/negotiation/hooks'
import userSelectors from 'services/user/selectors'
import Spinner from 'components/icons/Spinner'
import mail from 'assets/icons/mail.svg'
import clock from 'assets/icons/clock.svg'

const Title = styled.p`
  margin-bottom: 5px;
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
  const isLandlord = useSelector(userSelectors.isLandlord)

  const title = isLandlord
    ? t('SUMMARY_SIGNING_WAITING_TENANT')
    : t('SUMMARY_SIGNING_WAITING_LANDLORD')
  const footer = title
  const msgMail1 = t('SUMMARY_SIGNING_EMAIL_SEND_TO')
  const msgMail2 = t('SUMMARY_SIGNING_EMAIL_SEND_WHEN')

  return (
    <div className={className}>
      <Title>{title}</Title>
      <IconMsg>
        <IconCol>
          <img src={mail} alt="mail" />
        </IconCol>
        <MsgCol>
          {signerInfo ? (
            <p>
              <b>
                {msgMail1}
                {` ${signerInfo.emailId} `}
              </b>
              {msgMail2}
            </p>
          ) : (
            <Spinner />
          )}
        </MsgCol>
      </IconMsg>
      <IconMsg>
        <IconCol>
          <img src={clock} alt="clock" />
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
