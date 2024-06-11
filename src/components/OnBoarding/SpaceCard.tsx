import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { get } from 'lodash'

import Colors from 'assets/Colors'
import { SpaceData } from 'services/onboarding/types'
import { formatCurrency } from 'services/global/util'
import {
  getRegionSizeDesc,
  getRegionCurrencyCode,
} from 'services/global/region'

import selectors from 'services/onboarding/selectors'
import { formatFloor } from 'services/onboarding/utils'

const Outline = styled.div`
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
  height: 90px;
  padding: 10px 14px;
  box-sizing: border-box;
  outline: none;
  border: 2px solid #6cb9d5;
  border-radius: 2px;
  position: relative;
  background-color: white;
  min-width: 100px;
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  cursor: pointer;
`
const GreyTitle = styled.div`
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
`

const GreySubTitle = styled.div`
  color: #828286;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  word-break: break-all;
  margin-top: -4px;
`

const Heading = styled.div`
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 28em;
`

const Column = styled(
  (props: {
    width: string
    className?: string
    children: React.ReactNode
    borderRight?: boolean
  }) => <div className={props.className}>{props.children}</div>,
)`
  ${props =>
    props.borderRight
      ? `
    flex: 1 1 auto;
    width: ${props.width};
  `
      : `
    flex: 0 0 auto;
    width: ${props.width};
  `}
  margin-right: 5px;
  height: 70px;
  overflow: hidden;
  border-right: ${props => (props.borderRight ? '1px solid #dddddd' : 'none')};
  @media (max-width: 385px) {
    border-right: none;
    display: ${props => (props.borderRight ? 'initial' : 'none')};
  }
`

const DupButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 5px;
  color: ${Colors.main.blue};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  z-index: 10;
  background-color: white;
`
const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 10px;
  cursor: pointer;
  border: none;
  z-index: 10;
  background-color: white;
`

const FixedSpaceCard = styled(
  (props: {
    className?: string
    space: SpaceData
    onClick: () => void
    onDuplicate: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void
    onRemove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }) => {
    const { formatMessage } = useIntl()
    const state = useSelector(selectors.onboardingState)
    const country = state ? state.country : ''
    const t = (s: string) => formatMessage({ id: s })
    const floor = formatFloor(
      props.space.spaceFloor as number,
      t('ONBOARDING_SPACE_FLOOR'), country
    )
    const sizeUnits = getRegionSizeDesc(country)
    const rentUnits = getRegionCurrencyCode(country)
    return (
      <>
        <Outline className={props.className} onClick={props.onClick}>
          <DeleteButton
            data-testid="delete"
            title={t('ONBOARDING_REMOVE')}
            onClick={props.onRemove}>
            &#9587;
          </DeleteButton>
          <DupButton data-testid="dup" onClick={props.onDuplicate}>
            {t('ONBOARDING_SPACE_DUPLICATE')}
          </DupButton>

          <Column width="120px" borderRight={true}>
            <Heading>{props.space.spaceName}</Heading>
            <GreyTitle>{floor}</GreyTitle>
            <GreyTitle>{t('ONBOARDING_TYPE_FIXED')}</GreyTitle>
          </Column>
          <Column width="86px">
            <Heading>{`${props.space.spaceSize} ${sizeUnits}`}</Heading>
            <GreySubTitle>{t('ONBOARDING_SPACE_CARD_SIZE')}</GreySubTitle>
          </Column>
          <Column width="178px">
            <Heading>
              {formatCurrency(props.space.spaceRent || 0, rentUnits)}
            </Heading>
            <GreySubTitle>{t('ONBOARDING_SPACE_CARD_RENT')}</GreySubTitle>
          </Column>
        </Outline>
      </>
    )
  },
)`
  display: flex;
  flex-direction: row;
  align-items: start;
`

const FlexSpaceCard = styled(
  (props: {
    className?: string
    space: SpaceData
    onClick: () => void
    onDuplicate: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => void
    onRemove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }) => {
    const { formatMessage } = useIntl()
    const t = (s: string) => formatMessage({ id: s })
    const state = useSelector(selectors.onboardingState)
    const country = state ? state.country : ''
    const floor = formatFloor(
      props.space.spaceFloor as number,
      t('ONBOARDING_SPACE_FLOOR'), country
    )
    const numSO = get(props.space, 'servicedOffices.length', 0)

    return (
      <>
        <Outline className={props.className} onClick={props.onClick}>
          <DeleteButton
            data-testid="delete"
            title={t('ONBOARDING_REMOVE')}
            onClick={props.onRemove}>
            &#9587;
          </DeleteButton>
          <DupButton data-testid="dup" onClick={props.onDuplicate}>
            {t('ONBOARDING_SPACE_DUPLICATE')}
          </DupButton>
          <Column width="120px" borderRight={true}>
            <Heading data-testid="space-name">{props.space.spaceName}</Heading>
            <GreyTitle>{floor}</GreyTitle>
            <GreyTitle>{t('ONBOARDING_TYPE_FLEX')}</GreyTitle>
          </Column>
          <Column width="90px">
            <Heading>{get(props.space, 'hotDesks.desks', 0)}</Heading>
            <GreySubTitle>{t('ONBOARDING_PUBLISH_HOT_DESKS')}</GreySubTitle>
          </Column>
          <Column width="90px">
            <Heading>{get(props.space, 'fixedDesks.desks', 0)}</Heading>
            <GreySubTitle>{t('ONBOARDING_PUBLISH_FIXED_DESKS')}</GreySubTitle>
          </Column>
          <Column width="90px">
            <Heading>{numSO}</Heading>
            <GreySubTitle>
              {t('ONBOARDING_PUBLISH_SERVICED_OFFICES')}
            </GreySubTitle>
          </Column>
        </Outline>
      </>
    )
  },
)`
  display: flex;
  flex-direction: row;
  align-items: start;
`

const SpaceCard = (props: {
  space: SpaceData
  onClick: () => void
  onDuplicate: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onRemove: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) => {
  const { space, onClick, onDuplicate, onRemove } = props
  return space.type === 'FLEX' ? (
    <FlexSpaceCard
      space={space}
      onClick={onClick}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
    />
  ) : (
    <FixedSpaceCard
      space={space}
      onClick={onClick}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
    />
  )
}

export default SpaceCard
