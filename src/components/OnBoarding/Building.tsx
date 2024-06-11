import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import actions from 'services/onboarding/actions'
import selectors from 'services/onboarding/selectors'
import dashboardSelectors from 'services/dashboard/selectors'
import dashboardActions from 'services/dashboard/actions'
import NewExisting from '../OnBoarding/NewExisting'
import BuildingSeparator from '../OnBoarding/BuildingSeparator'
import BuildingList from './BuildingList'
import BuildingForm from './BuildingForm'
import Spinner from 'components/icons/Spinner'
import Container from './MainContainer'
import Heading1 from 'components/common/Heading1'

const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`

const Building = () => {
  const dispatch = useDispatch()
  const state = useSelector(selectors.onboardingState)
  const initOK = useSelector(dashboardSelectors.isDashboardInitOK)
  const loading = useSelector(dashboardSelectors.isDashboardLoading)
  const buildings = useSelector(dashboardSelectors.selectDashboardBuildings)
  const hasBuildings = buildings && buildings.length > 0
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const isNew = state.isNew

  useEffect(() => {
    if (!initOK) {
      dispatch(dashboardActions.dashboardInit())
    } else if (!hasBuildings && !loading) {
      dispatch(actions.setIsNew(true))
    }
  }, [dispatch, hasBuildings, loading, initOK])
  return (
    <Container>
      <Heading1>{t('ONBOARDING_TITLE')}</Heading1>
      <BuildingSeparator />
      {!initOK || loading ? (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      ) : (
        <>
          <NewExisting
            hasBuildings={hasBuildings}
            onClick={(isNew: boolean) => {
              if (isNew) {
                dispatch(actions.clear())
              }
              dispatch(actions.setIsNew(isNew))
            }}
            selected={isNew}
          />
          {isNew === false ? <BuildingList /> : null}
          {isNew === true ? <BuildingForm /> : null}
        </>
      )}
    </Container>
  )
}
export default Building
