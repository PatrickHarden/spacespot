import React from 'react'
import { Switch, Route } from 'react-router-dom'

import OnBoardingLayout from 'components/OnBoardingLayout'

import Building from 'components/OnBoarding/Building'
import EditBuilding from 'components/OnBoarding/EditBuilding'
import EditSpace from 'components/OnBoarding/EditSpace'
import Validating from 'components/OnBoarding/Validating'
import Space from 'components/OnBoarding/Space'
import Publish from 'components/OnBoarding/Publish'
import Published from 'components/OnBoarding/Published'

const OnBoarding = () => {
  return (
    <OnBoardingLayout>
      <Switch>
        <Route path="/onboarding/edit/building/:buildingId">
          <EditBuilding />
        </Route>
        <Route path="/onboarding/edit/space/:spaceId">
          <EditSpace />
        </Route>
        <Route path="/onboarding/space/:spaceId">
          <Space />
        </Route>
        <Route path="/onboarding/validating">
          <Validating />
        </Route>
        <Route path="/onboarding/publish">
          <Publish />
        </Route>
        <Route path="/onboarding/published">
          <Published />
        </Route>
        <Route>
          <Building />
        </Route>
      </Switch>
    </OnBoardingLayout>
  )
}

export default OnBoarding
