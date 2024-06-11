import React from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Checkbox from '@material-ui/core/Checkbox'

import Heading4 from 'components/common/Heading4'
import Input from 'components/common/Input'
import DatePicker from 'components/common/DatePicker'
import selectors from 'services/onboarding/selectors'
import moment from 'moment'

import {
  getRegionCurrencyDesc,
  getRegionSizeDesc,
} from 'services/global/region'
import { SpaceFormFields } from './SpaceForm'

const ContainerTwoInputs = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 50px;
`
// It will be probably re-added in future
// const Col = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
// `

const Header4 = styled(Heading4)`
  margin-bottom: 0;
`

type inputPaddingRight = {
  isRight?: boolean
}
const InputHalf = styled(Input)<inputPaddingRight>`
  margin-top: 20px;
  flex-grow: 1;
  width: 50%;
  padding-left: ${props => (props.isRight ? '20px' : '0')};
  label {
    white-space: nowrap;

    @media (max-width: 480px) {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`
const InputHalfSmall = styled(InputHalf)<{ isSmall?: boolean }>`
  padding-right: 10px;
  width: ${props => (props.isSmall ? '20%' : '25%')};
`

const InputDateOnBoarding = styled(DatePicker)`
  margin-top: 20px;
  flex-grow: 1;
`
// const InputSize = styled.div`
//   margin-top: 20px;
//   width: 27%;
// `
// const LabelInputSize = styled.label``
const ValueInputSize = styled.div`
  text-align: left;
  padding-top: 10px;
  font-weight: 500;
`

const PriceContainer = styled.div`
  @media (min-width: 480px) {
    display: flex;
  }
`
const PriceBlock = styled.div`
  @media (min-width: 480px) {
    width: 50%;
  }
`

// It will be probably re-added in future
// const NotNegotiableCheckbox = styled(FormControlLabel)`
//   float: right;
//   width: 50%;
//   margin-right: 0;
//   padding-top: 5px;
//   padding-left: 30px;

//   .MuiIconButton-label {
//     padding: 4px 0;
//   }
//   .MuiIconButton-root {
//     color: #6cb9d5;
//     padding: 0px 0;
//   }
//   .MuiFormControlLabel-label {
//     padding-left: 10px;
//   }
//   .MuiButtonBase-root:hover,
//   .Mui-checked.MuiButtonBase-root:hover {
//     background-color: rgba(108, 185, 213, 0.2);
//   }
// `
const SpaceAvailabilityFixed = (props: {
  fields: SpaceFormFields
  setFields: React.Dispatch<React.SetStateAction<SpaceFormFields>>
  errors: { [key: string]: string }
}) => {
  const state = useSelector(selectors.onboardingState)
  const country = state ? state.country : ''
  const regionUnit = getRegionSizeDesc(country)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { fields, setFields, errors } = props

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value
    setFields(prev => {
      return { ...prev, [field]: val }
    })
  }

  // const handleCBChange = (field: string) => (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const val = e.target.checked
  //   setFields(prev => {
  //     return { ...prev, [field]: val }
  //   })
  // }

  const handleChangeDate = (field: string) => (d?: string | null) => {
    if (d) {
      d = moment(d, 'DD/MM/YYYY').format('MM/DD/YYYY') as string
      setFields(prev => {
        return { ...prev, [field]: d }
      })
    }
  }

  const getYearlyPrice = () => {
    return (
      ((Number(fields.spaceRent) + Number(fields.spaceServices)) * 12) /
      (Number(fields.spaceSize) + Number(fields.spaceSizeCommon))
    ).toFixed(2)
  }

  const getMonthlyPrice = () => {
    const price: any =
      ((Number(fields.spaceRent) + Number(fields.spaceServices)) * 12) /
      (Number(fields.spaceSize) + Number(fields.spaceSizeCommon))

    return (price / 12).toFixed(2)
  }

  return (
    <>
      <Header4>{t('ONBOARDING_SPACE_AVAILABILITY_FIXED_TITLE')}</Header4>
      <ContainerTwoInputs>
        <InputDateOnBoarding
          id="availabilityFixed"
          format="dd.MM.yyyy"
          label={t('ONBOARDING_SPACE_AVAILABILITY')}
          value={new Date(fields.availabilityFixed)}
          onChange={handleChangeDate('availabilityFixed')}
          disablePast={true}
          error={errors.availabilityFixed}
        />
        <InputHalf
          isRight={true}
          id="months"
          type="number"
          label={t('ONBOARDING_SPACE_MONTHS')}
          onChange={handleChange('months')}
          placeholder={t('ONBOARDING_PLACEHOLDER_MONTHS')}
          value={fields.months}
          error={errors.months}
        />
      </ContainerTwoInputs>
      <Header4>{t('ONBOARDING_SPACE_MONTHLY_PAYMENT')}</Header4>
      <ContainerTwoInputs>
        <InputHalfSmall
          isSmall={true}
          id="spaceRent"
          type="number"
          label={`${t('ONBOARDING_SPACE_RENT')} (${getRegionCurrencyDesc(
            country,
          )})`}
          onChange={handleChange('spaceRent')}
          placeholder={t('ONBOARDING_PLACEHOLDER_RENT')}
          value={fields.spaceRent}
          error={errors.spaceRent}
        />
        {/* <Col> */}
        <InputHalfSmall
          id="spaceServices"
          type="number"
          label={`${t('ONBOARDING_SPACE_SERVICES')} (${getRegionCurrencyDesc(
            country,
          )})`}
          onChange={handleChange('spaceServices')}
          placeholder={t('ONBOARDING_PLACEHOLDER_MONTHLY_SERVICE')}
          value={fields.spaceServices}
          error={errors.spaceServices}
        />
        {/* It will be probably re-added in future
           <NotNegotiableCheckbox
            control={
              <Checkbox
                checked={fields.spaceServicesNotNegotiable}
                onChange={handleCBChange('spaceServicesNotNegotiable')}
                value="notNegotiable"
                disableRipple={true}
              />
            }
            label={t('ONBOARDING_SPACE_SERVICES_NOT_NEGOTIABLE')}
          />
         </Col> */}
      </ContainerTwoInputs>
      <PriceContainer>
        <PriceBlock>
          <Header4>
            {formatMessage(
              { id: 'ONBOARDING_SPACE_YEARLY_PRICE_PER_SIZE' },
              { regionUnitDesc: regionUnit },
            )}
          </Header4>

          <ValueInputSize>
            {Number(fields.spaceSize) + Number(fields.spaceSizeCommon) > 0 &&
            Number(fields.spaceRent) + Number(fields.spaceServices) > 0
              ? `${getYearlyPrice()} (${getRegionCurrencyDesc(country)})`
              : 0}
          </ValueInputSize>
        </PriceBlock>

        <PriceBlock>
          <Header4>
            {formatMessage(
              { id: 'ONBOARDING_SPACE_MONTHLY_PRICE_PER_SIZE' },
              { regionUnitDesc: regionUnit },
            )}
          </Header4>

          <ValueInputSize>
            {Number(fields.spaceSize) + Number(fields.spaceSizeCommon) > 0 &&
            Number(fields.spaceRent) + Number(fields.spaceServices) > 0
              ? `${getMonthlyPrice()} (${getRegionCurrencyDesc(country)})`
              : 0}
          </ValueInputSize>
        </PriceBlock>
      </PriceContainer>
    </>
  )
}
export default SpaceAvailabilityFixed
