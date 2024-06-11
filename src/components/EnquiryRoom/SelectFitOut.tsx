import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import userSelectors from 'services/user/selectors'
import spaceSelector, { getCountry } from 'services/space/selectors'
import enquirySelectors from 'services/enquiry/selectors'

import negotiationSelectors from 'services/negotiation/selectors'
import actions from 'services/negotiation/actions'
import device from 'services/global/device'

import FitoutForm from '../OnBoarding/FitoutForm'
import PlusIcon from 'components/icons/Plus'
import OutlinedButton from 'components/common/OutlinedButton'
import {
  FitoutOptionProps,
  SelectedFitoutOption,
  TermStatus,
} from 'services/negotiation/types'
import { getRegionCurrencyCode } from 'services/global/region'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Clear from '@material-ui/icons/Clear'
import { formatCurrency } from 'services/global/util'
import HTMLContent from 'components/common/HTMLContent'

const EachFitout = styled.div<{ isLandlord?: boolean }>`
  position: relative;
  box-sizing: border-box;
  border: 1px solid #dddddd;
  border-radius: 2px;
  padding: 20px;
  margin: 10px 0;
  background-color: ${props => (props.isLandlord ? '#FFFFFF' : '#F4F4F4')};
  cursor: ${props => (props.isLandlord ? 'auto' : 'pointer')};
`
const FitoutSelected = styled.div`
  padding: 20px;
  box-sizing: border-box;
  border: 2px solid #6cb9d5;
  border-radius: 2px;
  position: relative;
  margin-bottom: 10px;
`

const IconSelected = styled(CheckCircle)`
  position: absolute;
  background-color: #ffffff;
  top: -11px;
  right: -11px;
  &.MuiSvgIcon-root {
    font-size: 1.5rem;
  }
`
const FitoutTitle = styled.div`
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;
`
const Head3 = styled.h3`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
`

const FitoutAmount = styled.div`
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;
  float: right;
`

const FitoutDescription = styled.div`
  margin-top: 10px;
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
`

const ButtonChange = styled.button`
  padding-top: 0;
  color: #6d6c6c;
  border: none;
  outline: none;
  background: white;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`

const SelectedText = styled.div`
  color: #6cb9d5;
  font-weight: 400;
  line-height: 21px;
  float: right;
`

const SkipFloat = styled.div`
  margin-top: 40px;
`

const Container = styled.div`
  @media ${device.mobile} {
    margin: 0;
  }
`

const Plus = styled(PlusIcon)`
  margin: -2px 5px;
`
const ClearIcon = styled(Clear)`
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #dddddd;
  background-color: trasparent;
`
const TextEstimatedCost = styled.div`
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
  margin-top: 20px;
`
const TextExplanationFitout = styled.div`
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
`
const getSelectedFitout = (
  fitoutOptions: Array<FitoutOptionProps>,
  fitout?: SelectedFitoutOption,
) => {
  if (!fitout || !fitoutOptions) return false
  return fitoutOptions.find(
    (eachFitout: FitoutOptionProps) =>
      Number(eachFitout.id) === fitout.fitoutOption &&
      eachFitout.isCustom === fitout.custom,
  )
}

const SelectFitOut = (props: { disabled: boolean }) => {
  const { disabled } = props
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const isLandlord = useSelector(userSelectors.isLandlord)
  // FIXME select fitout from enquiry space
  const fitoutOptions = useSelector(spaceSelector.selectSpaceFitout)
  const [showForm, setShowForm] = useState(false)
  const enquiry = useSelector(enquirySelectors.getEnquiry)
  const enquiryStatus = get(enquiry, 'enquireStatus')

  const saveFitout = (fitout: FitoutOptionProps) => {
    setShowForm(false)
    dispatch(actions.putCustomFitout(fitout))
  }
  const selectFitout = (fitout: FitoutOptionProps) => {
    if (!isLandlord && !disabled) {
      dispatch(
        actions.selectFitout({
          custom: fitout.isCustom || false,
          fitoutOption: fitout.id,
        }),
      )
    }
  }
  const unselectFitout = () => {
    if (!isLandlord) {
      dispatch(
        actions.selectFitout({
          custom: false,
          fitoutOption: 0,
        }),
      )
    }
  }
  const deleteFituot = (fitout: FitoutOptionProps) => {
    if (isLandlord && fitout.isCustom) {
      dispatch(actions.deleteFitout(fitout.id as string))
    }
  }

  const space = useSelector(spaceSelector.selectedSpace)
  const country = getCountry(space)
  const currencyCode = getRegionCurrencyCode(country)

  // FIXME this dispatchs load actions every mount
  // use a selector that returns the thing | undefined
  // and dispatch only if undefined
  // or use a custom hook
  const selectedFitout = useSelector(negotiationSelectors.getNegotiationFitout)
  useEffect(() => {
    dispatch(actions.getCustomFitout())
  }, [dispatch])

  const selectedDataFitout = getSelectedFitout(fitoutOptions, selectedFitout)
  const noOptions = !fitoutOptions || fitoutOptions.length === 0

  if (enquiryStatus === TermStatus.Pending) {
    return (
      <Container>
        <p>{t('NEGOTIATE_FIT_OUT_PENDING_MSG')}</p>
      </Container>
    )
  }

  return (
    <Container>
      {selectedDataFitout && (
        <>
          <FitoutSelected>
            {!disabled && (
              <IconSelected fontSize="default" htmlColor="#6CB9D5" />
            )}
            <FitoutAmount>
              {formatCurrency(selectedDataFitout.amount, currencyCode)}
              {!isLandlord ? '*' : ''}
            </FitoutAmount>
            <FitoutTitle>{selectedDataFitout.name}</FitoutTitle>
            <FitoutDescription>
              <HTMLContent html={selectedDataFitout.description} />
            </FitoutDescription>
          </FitoutSelected>
          {!disabled && (
            <>
              {!isLandlord ? (
                <ButtonChange onClick={() => unselectFitout()}>
                  {t('CUSTOM_FITOUT_CHANGE_SELECTION')}
                </ButtonChange>
              ) : null}
              <SelectedText>{t('CUSTOM_FITOUT_SELECTED')}</SelectedText>
            </>
          )}
        </>
      )}
      {(!selectedDataFitout || isLandlord) &&
        fitoutOptions &&
        fitoutOptions.map((fitout: FitoutOptionProps) =>
          !selectedDataFitout ||
          fitout.isCustom !== selectedDataFitout.isCustom ||
          fitout.id !== selectedDataFitout.id ? (
            <EachFitout
              isLandlord={isLandlord}
              key={fitout.name}
              onClick={() => selectFitout(fitout)}>
              {isLandlord && fitout.isCustom ? (
                <ClearIcon onClick={() => deleteFituot(fitout)} />
              ) : null}
              <FitoutAmount>
                {formatCurrency(fitout.amount, currencyCode)}
                {!isLandlord ? '*' : ''}
              </FitoutAmount>
              <FitoutTitle>{fitout.name}</FitoutTitle>
              <FitoutDescription>
                <HTMLContent html={fitout.description} />
              </FitoutDescription>
            </EachFitout>
          ) : null,
        )}
      {!isLandlord && fitoutOptions && fitoutOptions.length >= 1 ? (
        <TextEstimatedCost>{t('NEGOTIATE_ESTIMATED_COST')}</TextEstimatedCost>
      ) : null}
      {noOptions && (
        <>
          {isLandlord ? (
            <Head3>{t('CUSTOM_FITOUT_EMPTY')}</Head3>
          ) : (
            <TextExplanationFitout>
              {t('NEGOTIATE_EXPLANATION_FITOUT')}
            </TextExplanationFitout>
          )}
        </>
      )}
      {!disabled && isLandlord && (
        <>
          {showForm ? (
            <SkipFloat>
              <FitoutForm
                setShow={() => setShowForm(false)}
                saveFitout={saveFitout}
              />
            </SkipFloat>
          ) : (
            <OutlinedButton onClick={() => setShowForm(true)}>
              <Plus size="1.1em" /> {t('CUSTOM_FITOUT_OPTION_ADD')}
            </OutlinedButton>
          )}
        </>
      )}
    </Container>
  )
}

export default SelectFitOut
