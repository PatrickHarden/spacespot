import React from 'react'
import { get } from 'lodash'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import device from 'services/global/device'
import userSelectors from 'services/user/selectors'
import negotiationSelectors from 'services/negotiation/selectors'
import enquirySelectors from 'services/enquiry/selectors'
import { NegotiationStatus } from 'services/negotiation/types'
import { useSigners } from 'services/negotiation/hooks'
import LeaseTerms from './LeaseTerms'
import SelectFitOut from './SelectFitOut'
import SpecialProvisions from './SpecialProvisions'
import Summary from './Summary'
import SummaryMobile from './SummaryMobile'
import Heading2 from 'components/common/Heading2'
import Congrats from './Congrats'
import spaceSelector from 'services/space/selectors'

const Explanation = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
`
const Block = styled.div`
  h1 {
    color: #000000;
    font-size: 25px;
    font-weight: 500;
    letter-spacing: -0.23px;
    line-height: 33px;
  }
`
const ContainerWrapper = styled.div`
  max-width: 1260px;
  margin: 0 auto;
`

const Container = styled.div`
  padding: 10px 20px;
  margin: 0 24px;
  display: flex;
  flex-direction: row;
  @media ${device.mobile} {
    flex-direction: column;
    padding: 10px 10px;
    margin: 0 0 100px 0;
  }
`
const Col1 = styled.div<{ disabled: boolean }>`
  flex: 1 0 70%;
  padding-top: 70px;
  @media ${device.mobile} {
    ${props => (props.disabled ? 'display: none;' : 'flex: 1 0 100%;')}
  }
`

const Col2 = styled.div<{ disabled: boolean }>`
  flex: 0 1 30%;
  margin-left: 20px;
  @media ${device.mobile} {
    margin: ${props => (props.disabled ? '0 auto' : '0 0 0 20px')};
    ${props => (props.disabled ? 'flex: 1 0 100%;' : 'display: none;')}
  }
`

const MobileFooter = styled.div<{ disabled: boolean }>`
  display: none;
  ${props =>
    props.disabled
      ? ''
      : `
  @media ${device.mobile} {
    z-index: 2;
    display: block;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: white;
  }`}
`
const Heading2MarginTop = styled(Heading2)`
  margin-top: 70px;
`
const Negotiation = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const enquiry = useSelector(enquirySelectors.getEnquiry)
  const isLandlord = useSelector(userSelectors.isLandlord)
  const selectedProvision = useSelector(
    negotiationSelectors.getNegotiationSpecialProvisions,
  )
  const negotiationStatus = useSelector(
    negotiationSelectors.getNegotiationStatus,
  )
  const fitoutOptions = useSelector(spaceSelector.selectSpaceFitout)

  const signers = useSigners()
  if (signers) {
    const pending = signers.filter(d => d.signerStatus !== 'completed')
    const bothSigned = signers.length > 0 && pending.length === 0
    if (bothSigned) {
      return <Congrats />
    }
  }

  const disabled =
    negotiationStatus !== NegotiationStatus.TermsAgreed &&
    negotiationStatus !== NegotiationStatus.TermsNotAgreed
  const isFlex = get(enquiry, 'flex', false)
  const foTitle = isLandlord
    ? t('NEGOTIATE_FIT_OUT_LANDLORD')
    : fitoutOptions && fitoutOptions.length > 1
    ? t('NEGOTIATE_FIT_OUT_TENANT_SELECTED')
    : t('NEGOTIATE_FIT_OUT_TENANT')

  const spTitle =
    !isLandlord && selectedProvision !== ''
      ? t('NEGOTIATE_PROVISIONS_TENANT_ACCEPT')
      : t('NEGOTIATE_PROVISIONS')
  return (
    <ContainerWrapper>
      <Container>
        <Col1 disabled={disabled}>
          <Block>
            <Explanation>
              {isLandlord
                ? t('NEGOTIATE_LANDLORD_EXPLANATION_1')
                : t('NEGOTIATE_EXPLANATION_1')}
            </Explanation>
            <Explanation>
              {isLandlord
                ? t('NEGOTIATE_LANDLORD_EXPLANATION_2')
                : t('NEGOTIATE_EXPLANATION_2')}
            </Explanation>
            <Explanation>
              {isLandlord
                ? t('NEGOTIATE_LANDLORD_EXPLANATION_3')
                : t('NEGOTIATE_EXPLANATION_3')}
            </Explanation>
          </Block>
          <Block>
            <Heading2MarginTop>{spTitle}</Heading2MarginTop>
            <SpecialProvisions disabled={disabled} />
          </Block>
          <Block>
            <Heading2>{t('NEGOTIATE_LEASE_TERMS')}</Heading2>
            <LeaseTerms disabled={disabled} />
          </Block>
          {!isFlex && (
            <Block>
              <Heading2MarginTop>{foTitle}</Heading2MarginTop>
              <SelectFitOut disabled={disabled} />
            </Block>
          )}
        </Col1>
        <Col2 disabled={disabled}>
          <Summary />
        </Col2>
        <MobileFooter disabled={disabled} id="footer">
          <SummaryMobile />
        </MobileFooter>
      </Container>
    </ContainerWrapper>
  )
}

export default Negotiation
