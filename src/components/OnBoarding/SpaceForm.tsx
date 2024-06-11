import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import selectors from 'services/onboarding/selectors'
import { getRegionSizeDesc } from 'services/global/region'
import Heading3 from 'components/common/Heading3'
import Heading4 from 'components/common/Heading4'
import PlusIcon from 'components/icons/Plus2'
import Input from 'components/common/Input'
import RichTextArea from 'components/common/RichTextArea'
import { SpaceData, SpaceStatus } from 'services/onboarding/types'
import actions from 'services/onboarding/actions'
import {
  CommonPhotos1,
  CommonBrochures1,
} from 'services/space/PropertyListingschema'
import {
  invalidURL,
  invalidString,
  invalidDate,
  invalidNumber,
} from 'services/global/util'
import history from 'browserhistory'

import SpaceAvailabilityFixed from './SpaceAvailabilityFixed'
import SpaceAvailabilityFlex from './SpaceAvailabilityFlex'
import NextBack from './NextBack'
import DropZone, { DropItem } from './DropZone'
import FitoutOptions from './FitoutOptions'
import { FIXED_TYPE_CONSTANT } from 'services/onboarding/utils'

const Container = styled.div`
  max-width: 516px;
`
const InputFullWidth = styled(Input)`
  width: 100%;
  margin-top: 20px;
`

const ContainerTwoInputsHalf = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: 480px) {
    flex-direction: column;
  }
`

type inputPaddingRight = {
  isRight?: boolean
}
const InputQuarter = styled(Input)<inputPaddingRight>`
  width: 25%;
  margin-top: 20px;
  label {
    white-space: nowrap;
  }
`
const InputHalf = styled(Input)`
  flex-grow: 1;
  margin-top: 20px;
  width: 35%;
  padding-right: 10px;
  label {
    white-space: nowrap;
  }
`
const InputSize = styled.div`
  margin-top: 20px;
  width: 15%;
`
const LabelInputSize = styled.label``
const ValueInputSize = styled.div`
  text-align: left;
  padding-top: 10px;
  font-weight: 500;
`

const Title = styled(Heading3)`
  margin-bottom: 0;
`
const Section = styled.div`
  margin-bottom: 50px;
`

const SubTitle = styled(Heading3)``

const DropText = styled.div`
  padding: 20px;
  text-align: center;
  > p {
    font-size: 18px;
    font-weight: 500;
    margin-top: 5px;
    margin-bottom: 0;
  }
`
const SubTitleInfo = styled.div`
  padding: 0 0 20px 0;
  color: #828286
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
`

const SectionTitle = styled(Heading4)``

const RadioButtonLabel = styled(FormControlLabel)`
  .MuiFormControlLabel-label {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  }
  .MuiIconButton-label,
  .MuiIconButton-root {
    color: #6cb9d5;
    padding: 3px;
  }
  .MuiButtonBase-root:hover,
  .Mui-checked.MuiButtonBase-root:hover {
    background-color: rgba(108, 185, 213, 0.2);
  }
`
const ContainerRadio = styled.div`
  margin-left: 15px;
`

export interface SpaceFormFields {
  spaceName: string
  spaceDescription: string
  spaceHighlights: string
  spaceSize: string
  spaceSizeCommon: string
  spaceFloor: string
  spaceMatterPort: string
  spaceFloored: string
  use: string
  months: string
  spaceRent: string
  spaceServices: string
  availabilityFixed: string
  spaceServicesNotNegotiable: boolean
}

const loadFields = (space: SpaceData) => {
  const fields: SpaceFormFields = {
    spaceName: '',
    spaceDescription: '',
    spaceHighlights: '',
    spaceSize: '',
    spaceSizeCommon: '',
    spaceFloor: '',
    spaceMatterPort: '',
    spaceFloored: '',
    use: '',
    months: '',
    spaceRent: '',
    spaceServices: '',
    availabilityFixed: '',
    spaceServicesNotNegotiable: false,
  }
  if (space) {
    fields.spaceName = space.spaceName
    fields.spaceDescription = space.spaceDescription
    fields.spaceHighlights = space.spaceHighlights
    fields.spaceSize = space.spaceSize ? space.spaceSize.toString() : ''
    fields.spaceSizeCommon = space.spaceSizeCommon
      ? space.spaceSizeCommon.toString()
      : ''
    fields.spaceFloor = space.spaceFloor ? space.spaceFloor.toString() : ''
    fields.spaceMatterPort = space.spaceMatterPort
    fields.spaceFloored = space.spaceFloored
    fields.use = space.use
    fields.spaceRent = space.spaceRent ? space.spaceRent.toString() : ''
    fields.availabilityFixed = space.availabilityFixed
      ? space.availabilityFixed.toString()
      : ''
    fields.months = space.months ? space.months.toString() : ''
    fields.spaceServices = space.spaceServices
      ? space.spaceServices.toString()
      : ''
    fields.spaceServicesNotNegotiable = space.spaceServicesNotNegotiable
  }
  return fields
}

const SpaceForm = (props: { space: SpaceData; isEditing?: boolean }) => {
  const dispatch = useDispatch()
  const [hasTriedNext, setHasTriedNext] = useState(false)
  const [flexError, setFlexError] = useState(null as string | null)

  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const formRef = React.createRef<HTMLDivElement>()
  const { space, isEditing } = props
  const { images, floorPlan, type, uploadedFloorPlans, uploadedImages } = space

  const initialFields = loadFields(space)
  const [fields, setFields] = useState(initialFields)

  const state = useSelector(selectors.onboardingState)
  const country = state ? state.country : ''

  const focusInto = (id: string) => {
    const elm = document.getElementById(id)
    if (elm) {
      // elm.scrollIntoView()
      elm.focus()
    }
  }

  const validate = () => {
    const errors: { [key: string]: string } = {}
    if (invalidString(fields.spaceName)) errors.spaceName = t('VAL_INVALID')
    if (invalidURL(fields.spaceFloored))
      errors.spaceFloored = t('ONBOARDING_INVALID_URL')
    if (invalidURL(fields.spaceMatterPort))
      errors.spaceMatterPort = t('ONBOARDING_INVALID_URL')
    if (type === 'FIXED') {
      if (invalidNumber(fields.months, 1)) errors.months = t('VAL_INVALID')
      if (invalidNumber(fields.spaceRent, 0))
        errors.spaceRent = t('VAL_INVALID')
      if (invalidNumber(fields.spaceServices, 0))
        errors.spaceServices = t('VAL_INVALID')
      if (invalidNumber(fields.spaceSize, 1, 5000))
        errors.spaceSize = formatMessage(
          { id: 'VAL_INVALID_MAX' },
          { number: 5000 },
        )
      if (invalidNumber(fields.spaceSizeCommon, 0, 5000))
        errors.spaceSizeCommon = formatMessage(
          { id: 'VAL_INVALID_MAX' },
          { number: 5000 },
        )
      if (invalidNumber(fields.spaceFloor, -999, 999))
        errors.spaceFloor = formatMessage(
          { id: 'VAL_INVALID_MAX_MIN' },
          { max: 999, min: -999 },
        )
      if (invalidDate(fields.availabilityFixed))
        errors.availabilityFixed = t('VAL_INVALID')
    }
    return errors
  }
  const errors = hasTriedNext ? validate() : {}

  const submit = () => {
    const errors = validate()
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      focusInto(keys[0])
      setHasTriedNext(true)
      return
    }
    if (type !== 'FIXED' && flexError) {
      focusInto(flexError)
      setHasTriedNext(true)
      return
    }

    // save space
    dispatch(actions.setSpaceName(space.id, fields.spaceName))
    dispatch(actions.setSpaceUse(space.id, fields.use))
    dispatch(actions.setSpaceDescription(space.id, fields.spaceDescription))
    dispatch(actions.setSpaceHighlights(space.id, fields.spaceHighlights))
    dispatch(actions.setSpaceStatus(space.id, SpaceStatus.ReadyForPublish))
    dispatch(actions.setSpaceSize(space.id, Number(fields.spaceSize)))
    dispatch(
      actions.setSpaceSizeCommon(space.id, Number(fields.spaceSizeCommon)),
    )
    dispatch(actions.setSpaceFloor(space.id, Number(fields.spaceFloor)))
    dispatch(actions.setSpaceUse(space.id, fields.use))
    dispatch(actions.setSpaceFloored(space.id, fields.spaceFloored))
    dispatch(actions.setSpaceMatterPort(space.id, fields.spaceMatterPort))

    dispatch(
      actions.setSpaceAvailabilityFixed(
        space.id,
        new Date(fields.availabilityFixed),
      ),
    )
    dispatch(actions.setSpaceMonths(space.id, Number(fields.months)))
    dispatch(actions.setSpaceRent(space.id, Number(fields.spaceRent)))
    dispatch(actions.setSpaceServices(space.id, Number(fields.spaceServices)))
    dispatch(
      actions.setSpaceServicesNotNegotiable(
        space.id,
        fields.spaceServicesNotNegotiable,
      ),
    )

    if (!isEditing) {
      return dispatch(actions.goToPublish())
    }
    dispatch(actions.updateSpace())
    history.push(`/onboarding/published`)
  }

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value
    setFields(prev => {
      return { ...prev, [field]: val }
    })
  }

  const handleRTAChange = (field: string) => (val: string) => {
    setFields(prev => {
      return { ...prev, [field]: val }
    })
  }

  return (
    <>
      <Container ref={formRef}>
        <Section>
          <Title>
            {t(
              type === FIXED_TYPE_CONSTANT
                ? 'ONBOARDING_SPACE_DETAILS_FIXED'
                : 'ONBOARDING_SPACE_DETAILS_FLEX',
            )}
          </Title>
          <InputFullWidth
            type="text"
            id="spaceName"
            label={t('ONBOARDING_SPACE_NAME')}
            onChange={handleChange('spaceName')}
            placeholder={t('ONBOARDING_PLACEHOLDER_HEADLINE')}
            value={fields.spaceName}
            error={errors.spaceName}
          />
          <RichTextArea
            id="spaceDescription"
            label={t('ONBOARDING_SPACE_DESCRIPTION')}
            onChange={handleRTAChange('spaceDescription')}
            placeholder={t('ONBOARDING_PLACEHOLDER_DESCRIPTION')}
            value={fields.spaceDescription}
            error={errors.spaceDescription}
            rows={4}
          />
          <RichTextArea
            id="spaceHighlights"
            label={t('ONBOARDING_SPACE_HIGHLIGHTS')}
            onChange={handleRTAChange('spaceHighlights')}
            placeholder={t('ONBOARDING_PLACEHOLDER_HIGHLIGHTS')}
            value={fields.spaceHighlights}
            error={errors.spaceHighlights}
            rows={4}
          />
          {type === 'FIXED' ? (
            <>
              <ContainerTwoInputsHalf>
                <InputHalf
                  id="spaceSize"
                  type="number"
                  label={`${t('ONBOARDING_SPACE_SIZE')} (${getRegionSizeDesc(
                    country,
                  )})`}
                  onChange={handleChange('spaceSize')}
                  placeholder={t('ONBOARDING_PLACEHOLDER_EXCLUSIVE_SIZE')}
                  value={fields.spaceSize}
                  error={errors.spaceSize}
                />
                <InputHalf
                  id="spaceSizeCommon"
                  type="number"
                  label={`${t(
                    'ONBOARDING_SPACE_SIZE_COMMON',
                  )} (${getRegionSizeDesc(country)})`}
                  onChange={handleChange('spaceSizeCommon')}
                  placeholder={t('ONBOARDING_PLACEHOLDER_COMMON_AREAS')}
                  value={fields.spaceSizeCommon}
                  error={errors.spaceSizeCommon}
                />
                <InputSize>
                  <LabelInputSize>
                    {t('ONBOARDING_SPACE_SIZE_TOTAL')}
                  </LabelInputSize>
                  <ValueInputSize>
                    {Number(fields.spaceSize) + Number(fields.spaceSizeCommon)}
                  </ValueInputSize>
                </InputSize>
              </ContainerTwoInputsHalf>
              <InputQuarter
                id="spaceFloor"
                type="number"
                label={t('ONBOARDING_SPACE_FLOOR')}
                onChange={handleChange('spaceFloor')}
                placeholder={t('ONBOARDING_PLACEHOLDER_FLOOR')}
                value={fields.spaceFloor}
                error={errors.spaceFloor}
              />
            </>
          ) : null}
        </Section>
        {type === 'FIXED' ? (
          <Section>
            <SectionTitle>{t('ONBOARDING_SPACE_USE_TITLE')}</SectionTitle>
            <ContainerRadio>
              <RadioGroup
                name="use"
                value={fields.use}
                onChange={handleChange('use')}>
                <RadioButtonLabel
                  value="OFFICE"
                  control={<Radio disableRipple={true} />}
                  label={t('ONBOARDING_SPACE_USE_OFFICE')}
                />
                <RadioButtonLabel
                  value="RETAIL"
                  control={<Radio disableRipple={true} />}
                  label={t('ONBOARDING_SPACE_USE_RETAIL')}
                />
                <RadioButtonLabel
                  value="OFFICE_RETAIL"
                  control={<Radio disableRipple={true} />}
                  label={t('ONBOARDING_SPACE_USE_OFFICE_RETAIL')}
                />
              </RadioGroup>
            </ContainerRadio>
          </Section>
        ) : null}
        <Section>
          {type === FIXED_TYPE_CONSTANT ? (
            <>
              <SectionTitle>
                {t('ONBOARDING_FLOORED_MATTERPORT_TITLE')}
              </SectionTitle>
              <InputFullWidth
                type="text"
                id="spaceFloored"
                label={t('ONBOARDING_SPACE_FLOORED')}
                onChange={handleChange('spaceFloored')}
                value={fields.spaceFloored}
                error={errors.spaceFloored}
              />
            </>
          ) : null}
          <InputFullWidth
            type="text"
            id="spaceMatterPort"
            label={t('ONBOARDING_SPACE_MATTERPORT')}
            onChange={handleChange('spaceMatterPort')}
            value={fields.spaceMatterPort}
            error={errors.spaceMatterPort}
          />
        </Section>
      </Container>
      <Section>
        {type === FIXED_TYPE_CONSTANT ? (
          <Container>
            <SpaceAvailabilityFixed
              fields={fields}
              setFields={setFields}
              errors={errors}
            />
          </Container>
        ) : null}
        {type === 'FLEX' ? (
          <SpaceAvailabilityFlex space={space} setError={setFlexError} />
        ) : null}
      </Section>
      <Section>
        <SubTitle>{t('ONBOARDING_SPACE_PHOTOS')}</SubTitle>
        <SubTitleInfo>{t('ONBOARDING_PHOTOS_INFO')}</SubTitleInfo>
        <DropZone
          items={images}
          setItems={(images: Array<DropItem>) => {
            dispatch(actions.setSpaceImages(space.id, images))
          }}
          isImage={true}
          setUploaded={(images: CommonPhotos1 | CommonBrochures1) => {
            dispatch(
              actions.setSpaceUploadedImages(space.id, images as CommonPhotos1),
            )
          }}
          uploaded={uploadedImages}
          accept="image/jpeg, image/png">
          <DropText>
            <PlusIcon size="3em" />
            <p>
              {t('ONBOARDING_PHOTOS_ADD')}
              <br />
              {t('ONBOARDING_PHOTOS_DRAG')}
            </p>
          </DropText>
        </DropZone>
      </Section>
      <Section>
        <SubTitle>{t('ONBOARDING_SPACE_FLOORPLAN')}</SubTitle>
        <SubTitleInfo>{t('ONBOARDING_FLOORPLAN_INFO')}</SubTitleInfo>
        <DropZone
          items={floorPlan}
          setItems={(images: Array<DropItem>) => {
            dispatch(actions.setSpaceFloorPlan(space.id, images))
          }}
          isImage={true}
          uploaded={uploadedFloorPlans}
          setUploaded={(floorplans: CommonPhotos1 | CommonBrochures1) => {
            dispatch(
              actions.setSpaceUploadedFloorPlans(
                space.id,
                floorplans as CommonPhotos1,
              ),
            )
          }}
          accept="image/jpeg, image/png, application/pdf, .bim">
          <DropText>
            <PlusIcon size="3em" />
            <p>
              {t('ONBOARDING_FLOORPLAN_ADD')}
              <br />
              {t('ONBOARDING_FLOORPLAN_DRAG')}
            </p>
          </DropText>
        </DropZone>
      </Section>
      <Container>
        {type === 'FIXED' ? <FitoutOptions space={space} /> : null}
      </Container>
      <NextBack
        next={{
          label: isEditing ? t('ONBOARDING_EDIT') : t('ONBOARDING_CONTINUE'),
          onClick: submit,
        }}
        back={{
          label: t('ONBOARDING_BACK'),
          onClick: () =>
            isEditing
              ? history.push(`/dashboard`)
              : history.push(`/onboarding/building`),
        }}
      />
    </>
  )
}
export default SpaceForm
