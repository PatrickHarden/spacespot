import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import actions from 'services/onboarding/actions'
import onboardingSelectors from 'services/onboarding/selectors'
import BuildingSeparator from './BuildingSeparator'
import Spinner from 'components/icons/Spinner'
import history from 'browserhistory'
import FilledButton from 'components/common/FilledButton'
import Heading1 from 'components/common/Heading1'
import Heading2 from 'components/common/Heading2'
import Container from './MainContainer'

import hourglass from 'assets/icons/hourglass.svg'

const EditedContainer = styled.div`
  text-align: center;
`
const Title = styled(Heading1)``

const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`
const Wait5MinsIcon = styled.img`
  padding: 70px 0 10px 0;
`

const EditedTitle = styled(Heading2)`
  margin-bottom: 0;
`

const EditedText = styled(Heading2)`
  margin-top: 0;
`

const ListSpaces = styled(FilledButton)`
  margin-top: 40px;
  width: 176px;
  background-color: #404042;
  color: #ffffff;
`

const Validating = () => {
  const dispatch = useDispatch()
  const isPublshing = useSelector(onboardingSelectors.onboardingIsPublishing)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <Container>
      {isPublshing ? (
        <>
          <Title>{t('ONBOARDING_TITLE')}</Title>
          <BuildingSeparator />
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
        </>
      ) : (
        <EditedContainer>
          <Wait5MinsIcon src={hourglass} alt="hourglass" />
          <EditedTitle>{t('ONBOARDING_EDITED_TITLE')}</EditedTitle>
          <EditedText>{t('ONBOARDING_EDITED_TEXT')}</EditedText>
          <ListSpaces
            onClick={() => {
              dispatch(actions.resetSpaces())
              history.push(`/onboarding/`)
            }}>
            {t('ONBOARDING_EDITED_LIST_SPACES')}
          </ListSpaces>
        </EditedContainer>
      )}
    </Container>
  )
}
export default Validating
