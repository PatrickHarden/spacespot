import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'

import device from 'services/global/device'
import userSelectors from 'services/user/selectors'
import negSelectors from 'services/negotiation/selectors'
import negActions from 'services/negotiation/actions'
import spaceSelectors from 'services/space/selectors'
import { getImages, getStreet, getTitle } from 'services/space/helpers'
import { useSigners, useNegotiationTerms } from 'services/negotiation/hooks'
import Heading2 from 'components/common/Heading2'
import Heading3 from 'components/common/Heading3'
import Heading4 from 'components/common/Heading4'
import circleCheck from 'assets/icons/circle-check.svg'

import OutlinedButton from 'components/common/OutlinedButton'
import { getUserLanguage } from 'intl'

const Box = styled.div`
  min-height: 250px;
  margin-top: 56px;
  border: 1px solid #dddddd;
  border-radius: 2px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  text-align: left;
  @media ${device.mobile} {
    box-shadow: none;
    border: none;
  }
  img {
    width: 100%;
    height: 275px;
    object-fit: cover;
  }
`

const Block = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
`

const Download = styled.div`
  padding: 10px 20px;
  text-align: center;
  margin: 10px auto;
`

const Name = styled(Heading3)`
  color: black;
  margin-top: 0;
  margin-bottom: 4px;
`

const Address = styled.p`
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  margin-top: 0;
  margin-bottom: 20px;
`

const Line = styled.p`
  color: #404042;
  margin-top: 2px;
  margin-bottom: 2px;
`

const Subtitle = styled(Heading4)`
  margin-top: 10px;
  margin-bottom: 10px;
`

const Congrats = styled((props: { className?: string }) => {
  const { className } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()

  const isLandlord = useSelector(userSelectors.isLandlord)
  const space = useSelector(spaceSelectors.selectedSpace)
  const images = getImages(space)
  const address = getStreet(space)
  const name = getTitle(space)
  const signers = useSigners()
  const terms = useNegotiationTerms()
  const negId = useSelector(negSelectors.getNegotiationId)
  const confCode = `SSL${10000 + negId}`

  let startDate = ''
  let endDate = ''
  if (terms) {
    const begin = moment(terms.start)
    const duration = terms.duration || 1
    const end = moment(terms.start).add(duration, 'months')
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    startDate = moment(begin)
      .toDate()
      .toLocaleString(getUserLanguage(), options)
    endDate = moment(end)
      .toDate()
      .toLocaleString(getUserLanguage(), options)
  }

  let peerName = ''
  let peerEmail = ''
  let peerCompany
  let peerNumber
  if (signers) {
    const peer = signers.filter(
      d => d.signerType === (isLandlord ? 'Tenant' : 'Landlord'),
    )
    peerName = peer[0].name
    peerEmail = peer[0].emailId
    peerCompany = peer[0].companyName
    peerNumber = peer[0].companyNumber
  }

  const title = isLandlord
    ? t('CONGRATS_LANDLORD_TITLE')
    : t('CONGRATS_TENANT_TITLE')
  const peer = isLandlord ? t('CONGRATS_TENANT') : t('CONGRATS_LANDLORD')

  return (
    <div className={className}>
      <Heading2>{title}</Heading2>
      <img src={circleCheck} alt="check" />
      <Box>
        {images && images[0] && <img src={images[0].original} alt="space" />}
        <Block>
          <Name>{name}</Name>
          <Address>{address}</Address>
          <Line>
            {startDate} &rarr; {endDate}
          </Line>
        </Block>
        <Block>
          <Subtitle>{peer}</Subtitle>
          {peerCompany && <Line>{peerCompany}</Line>}
          {peerNumber && <Line>{peerNumber}</Line>}
          <Line>{peerName}</Line>
          <Line>{peerEmail}</Line>
        </Block>
        <Block>
          <Subtitle>{t('CONGRATS_CONFIRMATION_CODE')}</Subtitle>
          <Line>{confCode}</Line>
        </Block>
        <Download>
          <OutlinedButton
            onClick={() => dispatch(negActions.getLeaseDocument())}>
            {t('CONGRATS_DOWNLOAD')}
          </OutlinedButton>
        </Download>
      </Box>
    </div>
  )
})`
  max-width: 420px;
  margin: 0 auto;
  margin-bottom: 60px;
  padding-top: 50px;
  min-width: 250px;
  text-align: center;
  & > h2 {
    color: #000000;
    margin: 0 0 37px 0;
  }
`

export default Congrats
