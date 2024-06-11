import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import dashboardSelectors from 'services/dashboard/selectors'
import onboardingSelectors from 'services/onboarding/selectors'
import onboardingActions from 'services/onboarding/actions'
import dashboardActions from 'services/dashboard/actions'
import Spinner from 'components/icons/Spinner'
import SpaceForm from './SpaceForm'
import Container from './MainContainer'

const Title = styled.div`
  padding: 40px 0 0 0;
  color: #404042;
  font-size: 32px;
  font-weight: 500;
  line-height: 41px;
`

const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`

const EditSpace = () => {
  const { spaceId } = useParams()
  const id = spaceId ? spaceId : '0'

  const dispatch = useDispatch()
  const initOK = useSelector(dashboardSelectors.isDashboardInitOK)
  const loading = useSelector(dashboardSelectors.isDashboardLoading)
  const state = useSelector(onboardingSelectors.onboardingState)

  const space = useSelector(dashboardSelectors.selectDashboardSpaceCurried)(id)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  useEffect(() => {
    if (!loading) {
      if (!initOK) {
        dispatch(dashboardActions.dashboardInit())
      } else if (space) {
        dispatch(onboardingActions.onboardingEditSpace(space))
      }
    }
  }, [dispatch, initOK, loading, space])

  return (
    <Container>
      <Title>{t('ONBOARDING_TITLE_EDIT_SPACE')}</Title>
      {loading || !state.spaces[id] ? (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      ) : (
        <SpaceForm space={state.spaces[id]} isEditing={true} />
      )}
    </Container>
  )
}
export default EditSpace
