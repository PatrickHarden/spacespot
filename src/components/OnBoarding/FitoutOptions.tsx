import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import actions from 'services/onboarding/actions'
import selectors from 'services/onboarding/selectors'
import { SpaceData } from 'services/onboarding/types'
import { FitoutOptionProps } from 'services/negotiation/types'

import { useIntl } from 'react-intl'
import PlusIcon from 'components/icons/Plus'
import Heading3 from 'components/common/Heading3'
import { getRegionCurrencyDesc } from 'services/global/region'
import OutlinedButton from 'components/common/OutlinedButton'
import Clear from '@material-ui/icons/Clear'

import FitoutForm from './FitoutForm'
import HTMLContent from 'components/common/HTMLContent'

const Container = styled.div``

const FitoutAllContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const FitoutContainer = styled.div`
  margin: 20px 0 0 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #dddddd;
  background-color: #f4f4f4;
  position: relative;
`

const FitoutDescription = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
`
const ClearIcon = styled(Clear)`
  color: #000000;
  font-size: 15px;
  font-weight: 500;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background-color: trasparent;
`

const FitoutOptionTitle = styled.div`
  color: #000000;
  font-weight: 500;
`
const FitoutOptionDescription = styled.div`
  margin: 10px 0;
`
const FitoutOptionPrice = styled.div`
  color: #000000;
  font-weight: 500;
`
const AddFitout = styled(OutlinedButton)`
  margin-top: 20px;
  box-sizing: border-box;
  svg {
    margin: 0px 5px -3px 0px;
  }
`

const Plus = styled(PlusIcon)`
  margin: -2px 5px;
`
const FitoutOptions = (props: { space: SpaceData }) => {
  const dispatch = useDispatch()
  const state = useSelector(selectors.onboardingState)
  const country = state ? state.country : ''
  const { space } = props
  const { fitout } = space
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const [show, setShow] = useState(false)

  const deleteFitout = (index: number) =>
    dispatch(
      actions.setSpaceFitout(
        space.id,
        fitout.filter(
          (_option: FitoutOptionProps, indexFilter: number) =>
            index !== indexFilter,
        ),
      ),
    )

  const currency = getRegionCurrencyDesc(country)
  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const saveFitout = (newFitout: FitoutOptionProps) => {
    setShow(false)
    dispatch(actions.setSpaceFitout(space.id, [...fitout, newFitout]))
  }

  return (
    <Container>
      <Heading3>{t('ONBOARDING_FITOUT_OPTIONS_TITLE')}</Heading3>
      <FitoutDescription>
        {t('ONBOARDING_FITOUT_OPTIONS_DESCRIPTION')}
      </FitoutDescription>
      <FitoutAllContainer>
        {fitout &&
          fitout.map((option: FitoutOptionProps, index: number) => (
            <FitoutContainer key={option.name}>
              <ClearIcon
                fill="#000000"
                strokeWidth="1"
                onClick={() => deleteFitout(index)}
              />
              <FitoutOptionTitle>{option.name}</FitoutOptionTitle>
              <FitoutOptionDescription>
                <HTMLContent html={option.description} />
              </FitoutOptionDescription>
              <FitoutOptionPrice>
                {`${numberWithCommas(option.amount)}${currency}`}
              </FitoutOptionPrice>
            </FitoutContainer>
          ))}
      </FitoutAllContainer>
      {show ? (
        <FitoutForm setShow={() => setShow(false)} saveFitout={saveFitout} />
      ) : (
        <AddFitout onClick={() => setShow(true)}>
          <Plus size="1.1em" />
          {t('ONBOARDING_FITOUT_OPTIONS_ADD')}
        </AddFitout>
      )}
    </Container>
  )
}
export default FitoutOptions
