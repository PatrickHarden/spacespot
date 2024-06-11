import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import OutlineButton, { ButtonProps } from './OutlineButton'
import Heading4 from 'components/common/Heading4'

const Container = styled.div`
  padding: 0%;
  margin-bottom: 50px;
`
const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
`

const ButtonOnboarding = styled(OutlineButton)<ButtonProps>`
  text-align: center;
  padding: 28px 10px;
  margin-right: 20px;
  overflow: visible;
  :hover { ${props =>
    props.selected || props.disabled === true
      ? ''
      : `border: 1px solid #6cb9d5;
         box-sizing: border-box;
         box-shadow: 0 1px 4px 0 #6cb9d5;
         cursor: pointer`}
`

export interface NewExistingProps {
  onClick: (type: boolean) => void
  selected: boolean | undefined
  hasBuildings: boolean
}

const NewExisting = (props: NewExistingProps) => {
  const { onClick, selected, hasBuildings } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  return (
    <Container>
      <Heading4>{t('ONBOARDING_NEW_EXISTING')}</Heading4>
      <ButtonContainer>
        <ButtonOnboarding
          testId="existing-building"
          disabled={!hasBuildings}
          onClick={() => onClick(false)}
          selected={selected === false}>
          {t('ONBOARDING_EXISTING')}
        </ButtonOnboarding>
        <ButtonOnboarding
          testId="new-building"
          onClick={() => onClick(true)}
          selected={selected === true}>
          {t('ONBOARDING_NEW_BUILDING')}
        </ButtonOnboarding>
      </ButtonContainer>
    </Container>
  )
}
export default NewExisting
