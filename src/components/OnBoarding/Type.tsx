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
  max-width: 360px;
  flex: 1;
`
const TypeTitle = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
`
const TypeSubTitle = styled.div`
  color: #828286;
  font-size: 14px;
  font-weight: 400;
`
const TypeButton = styled(OutlineButton)<ButtonProps & { isLeft?: boolean }>`
  text-align: center;
  width: 47%
  padding: 28px 0;
  margin-right: ${props => (props.isLeft ? '6%' : '0')};
  :hover { ${props =>
    props.selected
      ? ''
      : `border: 1px solid #6cb9d5;
         box-sizing: border-box;
         box-shadow: 0 1px 4px 0 #6cb9d5;
         cursor: pointer`}
`

export interface TypeProps {
  onClick: (type: string) => void
  selected?: string
}

const Type = (props: TypeProps) => {
  const { onClick, selected } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  return (
    <Container>
      <Heading4>{t('ONBOARDING_TYPE_LEASE')}</Heading4>
      <ButtonContainer>
        <TypeButton
          testId="add-fixed"
          isLeft={true}
          onClick={() => onClick('FIXED')}
          selected={selected === 'FIXED'}>
          <TypeTitle>{t('ONBOARDING_TYPE_FIXED_STANDARD_OFFICE')}</TypeTitle>
          <TypeSubTitle>{t('ONBOARDING_TYPE_FIXED_SUBTITLE')}</TypeSubTitle>
        </TypeButton>
        <TypeButton
          testId="add-flex"
          onClick={() => onClick('FLEX')}
          selected={selected === 'FLEX'}>
          <TypeTitle>{t('ONBOARDING_TYPE_FLEX_COWORKING')}</TypeTitle>
          <TypeSubTitle>{t('ONBOARDING_TYPE_FLEX_SUBTITLE')}</TypeSubTitle>
        </TypeButton>
      </ButtonContainer>
    </Container>
  )
}
export default Type
