import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import actions from 'services/onboarding/actions'
import selectors from 'services/onboarding/selectors'
import Type from './Type'
import SpaceForm from './SpaceForm'
import SpaceSeparator from './SpaceSeparator'
import Header from './Header'
import Heading1 from 'components/common/Heading1'
import Container from './MainContainer'

const Space = () => {
  const dispatch = useDispatch()
  const state = useSelector(selectors.onboardingState)
  const { spaceId } = useParams()
  const id = spaceId ? spaceId : '0'
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const type = state.spaces[id] ? state.spaces[id].type : ''
  return (
    <Container>
      <Heading1>{t('ONBOARDING_SPACE_TITLE')}</Heading1>
      <Header />
      <SpaceSeparator />
      <Type
        onClick={(type: string) => dispatch(actions.setSpaceType(id, type))}
        selected={type}
      />
      {type !== '' ? <SpaceForm space={state.spaces[id]} /> : null}
    </Container>
  )
}
export default Space
