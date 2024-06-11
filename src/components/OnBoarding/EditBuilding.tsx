import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'

import dashboardSelectors from 'services/dashboard/selectors'
import dashboardActions from 'services/dashboard/actions'
import onboardingSelectors from 'services/onboarding/selectors'
import onboardingActions from 'services/onboarding/actions'
import BuildingForm from './BuildingForm'
import Spinner from 'components/icons/Spinner'
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

const EditBuilding = () => {
  const { buildingId } = useParams()
  const id = buildingId ? buildingId : '0'
  const dispatch = useDispatch()
  const initOK = useSelector(dashboardSelectors.isDashboardInitOK)
  const loading = useSelector(dashboardSelectors.isDashboardLoading)
  const building = useSelector(
    dashboardSelectors.selectDashboardBuildingCurried,
  )(id)
  const onboardingState = useSelector(onboardingSelectors.onboardingState)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  useEffect(() => {
    if (!loading) {
      if (!initOK) {
        dispatch(dashboardActions.dashboardInit())
      } else if (building) {
        dispatch(onboardingActions.onboardingEditBuilding(building))
      }
    }
  }, [building, dispatch, initOK, loading])

  return (
    <Container>
      <Title>{t('ONBOARDING_TITLE_EDIT_BUILDING')}</Title>
      {loading || buildingId !== onboardingState.buildingId ? (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      ) : (
        <BuildingForm isEditing={true} />
      )}
    </Container>
  )
}
export default EditBuilding
