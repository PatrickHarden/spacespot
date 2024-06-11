import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import PlusIcon from 'components/icons/Plus'
import actions from 'services/onboarding/actions'
import selectors from 'services/onboarding/selectors'
import { SpaceStatus } from 'services/onboarding/types'
import device from 'services/global/device'
import OutlineButton from './OutlineButton'
import FilledButton from 'components/common/FilledButton'
import SpaceCard from './SpaceCard'
import history from 'browserhistory'
import HTMLContent from 'components/common/HTMLContent'

const Outline = styled(OutlineButton)`
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
  height: 90px;
  padding: 10px 14px;
  cursor: pointer;
  overflow: hidden;
`

const PublishContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  @media ${device.mobile} {
    flex-direction: column;
  }
`
const PublishBuilding = styled.div`
  flex: 0 0 274px;
  @media ${device.mobile} {
    flex: 0 0 auto;
  }
`

const PublishSpaces = styled.div`
  flex: 3;
  margin-left: 20px;
  @media ${device.mobile} {
    flex: 0 0 auto;
    margin-left: 0;
  }
`

const PublishTitle = styled.h2`
  height: 21px;
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
  margin-top: 1em;
  margin-bottom: 0.3em;
`

const BlackTitle = styled.div`
  color: black;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 242px;
`
const GreyTitle = styled.div`
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  display: -webkit-inline-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AddSpaceButton = styled(FilledButton)`
  float: right;
  border: 1px solid #404042;
  color: black;
  background: white;
  span {
    margin-right: 10px;
  }
`
const EmptySpace = styled.div`
  min-height: 90px;
`

const Header = (props: {
  onAdd?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { onAdd } = props
  const dispatch = useDispatch()
  const state = useSelector(selectors.onboardingState)
  const readySpaces = Object.keys(state.spaces).filter(
    id => state.spaces[id].status === SpaceStatus.ReadyForPublish,
  )

  return (
    <PublishContainer>
      <PublishBuilding>
        <PublishTitle>{t('ONBOARDING_BUILDING')}</PublishTitle>
        <Outline
          selected
          disableIcon
          onClick={() => {
            history.push(`/onboarding/building`)
          }}>
          <BlackTitle>{state.address}</BlackTitle>
          <GreyTitle>
            <HTMLContent html={state.location} />
          </GreyTitle>
        </Outline>
      </PublishBuilding>
      <PublishSpaces>
        {onAdd && readySpaces.length > 0 && (
          <PublishTitle>{t('ONBOARDING_SPACES')}</PublishTitle>
        )}
        {onAdd &&
          readySpaces.map(id => (
            <SpaceCard
              key={id}
              space={state.spaces[id]}
              onClick={() => {
                history.push(`/onboarding/space/${id}`)
              }}
              onDuplicate={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => {
                event.stopPropagation()
                dispatch(actions.cloneSpace(id))
              }}
              onRemove={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ) => {
                event.stopPropagation()
                dispatch(actions.removeSpace(id))
              }}
            />
          ))}
        {onAdd && readySpaces.length === 0 && <EmptySpace />}
        {onAdd && (
          <AddSpaceButton data-testid="add-another" onClick={onAdd}>
            <span>
              <PlusIcon size="1em" color="#404042" />
            </span>
            {t('ONBOARDING_PUBLISH_ADD_SPACE')}
          </AddSpaceButton>
        )}
      </PublishSpaces>
    </PublishContainer>
  )
}
export default Header
