import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'

import selectors from 'services/onboarding/selectors'
import actions from 'services/onboarding/actions'
import Heading1 from 'components/common/Heading1'
import NextBack from '../OnBoarding/NextBack'
import Header from './Header'
import history from 'browserhistory'
import Container from './MainContainer'

const Publish = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const state = useSelector(selectors.onboardingState)
  const publishSpace = () => {
    dispatch(actions.init(state))
    history.push(`/onboarding/published`)
  }
  return (
    <Container>
      <Heading1>{t('ONBOARDING_TITLE')}</Heading1>
      <Header
        onAdd={() => {
          dispatch(actions.addNewSpaceAndGo())
        }}
      />
      <NextBack
        next={{
          label: t('ONBOARDING_PUBLISH'),
          onClick: publishSpace,
          disabled: !state.spaces || Object.keys(state.spaces).length === 0,
        }}
        back={{
          label: t('ONBOARDING_BACK'),
          onClick: () => history.push(`/onboarding/space/0`),
        }}
      />
    </Container>
  )
}
export default Publish
