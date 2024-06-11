import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import actions from 'services/dashboard/actions'
import selectors from 'services/dashboard/selectors'
import DashboardMain from 'components/Dashboard/Dashboard'
import OnBoardingLayout from 'components/OnBoardingLayout'
import Spinner from 'components/icons/Spinner'
import styled from 'styled-components'

const SpinnerC = styled((props: { className?: string }) => (
  <div className={props.className}>
    <Spinner />
  </div>
))`
  text-align: center;
  margin-top: 40px;
`

const Dashboard = () => {
  const dispatch = useDispatch()
  const initOK = useSelector(selectors.isDashboardInitOK)
  const loading = useSelector(selectors.isDashboardLoading)
  useEffect(() => {
    if (!initOK) {
      dispatch(actions.dashboardInit())
    }
  }, [dispatch, initOK])
  return (
    <OnBoardingLayout>
      {!initOK || loading ? <SpinnerC /> : <DashboardMain />}
    </OnBoardingLayout>
  )
}
export default Dashboard
