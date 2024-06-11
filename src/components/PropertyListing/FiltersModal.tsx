import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import {
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'

import DateFnsUtils from '@date-io/date-fns'

import selectors from 'services/search/selectors'
import actions from 'services/search/actions'
import {
  valuesRadius,
  valuesLength,
  valuesMaxRent,
} from 'services/search/filters'
import { SearchType, TypeFilter } from 'services/search/types'

import userSelectors from 'services/user/selectors'
import analytics from 'services/analytics'

const DialogStyled = styled(Dialog)`
  & > div.MuiDialog-container > div.MuiDialog-paper {
    margin-top: 48px;
    max-height: calc(100% - 48px);
    border-radius: 5px;
  }
`

const DialogTitleStyled = styled(DialogTitle)`
  padding: 18px 15px;
  font-size: 25px;
  font-weight: 500;
  letter-spacing: -0.23px;
  line-height: 33px;
  button {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #828286;
    span svg {
      height: 24px;
      width: 24px;
    }
  }
`

const DialogContentStyled = styled(DialogContent)`
  padding-right: 42px;
`

const DialogActionsStyled = styled(DialogActions)`
  height: 40px;
  > button {
    flex: 1;
  }
`

const ButtonClear = styled.button`
  color: #404042;
  height: 36px;
  font-size: 14px;
  font-weight: 600;
  background-color: transparent;
  text-transform: uppercase;
  box-shadow: none;
`
const ButtonApply = styled.button`
  border-radius: 2px;
  background-color: #404042;
  height: 36px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: none;
`

const Line = styled.hr`
  box-sizing: border-box;
  height: 1px;
  width: 338px;
  border: 1px solid #979797;
`

const SliderContainer = styled.div`
  width: 95%;
  margin-top: 0;
  margin-bottom: 16px;
  display: flex;
  flex-flow: column wrap;
  align-content: flex-start;
  label {
    font-size: 18px;
    font-weight: 400;
    line-height: 23px;
    margin-bottom: 8px;
  }
`

const SliderMaterialStyled = styled(Slider)`
  margin-left: 7px;
  .MuiSlider-markLabel {
    font-size: 14px;
  }
`
const DatePickerContainer = styled.div`
  margin-top: 0;
  margin-bottom: 22px;
  display: flex;
  flex-flow: column wrap;
  align-content: flex-start;
  label {
    font-size: 18px;
    font-weight: 400;
    line-height: 23px;
  }
`

const KeyboardDatePickerStyled = styled(KeyboardDatePicker)`
  input {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  }
`
const ChecksContainer = styled.div`
  margin-top: 0;
  margin-bottom: 22px;
  display: flex;
  flex-flow: column wrap;
  align-content: flex-start;
`

const LabelStyled = styled.label`
  font-size: 18px;
  font-weight: 400;
  line-height: 23px;
  margin-bottom: 10px;
`

const FormControlLabelStyled = styled(FormControlLabel)`
  margin-left: -6px;
  span {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
  }
`
const MenuItemStyled = styled(MenuItem)`
  font-size: 16px;
`
const MenuItemStyledFirst = styled(MenuItem)`
  font-size: 16px;
  font-weight: 500;
`
const SelectStyled = styled(Select)`
  padding: 10px;
  min-width: 110px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  & .MuiSelect-select:focus {
    background-color: transparent;
  }
`

export type IModal = {
  open: boolean
  onClose: () => void
}

const FiltersModal = (props: IModal) => {
  const { open, onClose } = props

  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()

  const filteredRadius = useSelector(selectors.searchFiltersRadius)
  const filteredRadiusId = get(
    valuesRadius.find(value => value.value === filteredRadius.toString()),
    'id',
    1,
  )
  const filteredWhen = useSelector(selectors.searchFiltersWhen)
  const filteredLength = useSelector(selectors.searchFiltersLength)
  const filteredLengthId = get(
    valuesLength.find(value => value.value === filteredLength),
    'id',
    1,
  )
  const filteredMaxRent = useSelector(selectors.searchFiltersMaxRent)

  const filteredType = useSelector(selectors.searchFiltersType)
  const GAUser = useSelector(userSelectors.getGAUser)

  const onCloseModal = () => {
    dispatch(actions.searchInit())
    onClose()
  }
  const onClear = () => {
    dispatch(
      actions.changeFilter({
        type: TypeFilter.when,
        data: null,
        notSearching: true,
      }),
    )
    dispatch(
      actions.changeFilter({
        type: TypeFilter.type,
        data: null,
        notSearching: true,
      }),
    )
    dispatch(
      actions.changeFilter({
        type: TypeFilter.radius,
        data: null,
        notSearching: true,
      }),
    )
    dispatch(
      actions.changeFilter({
        type: TypeFilter.length,
        data: null,
        notSearching: true,
      }),
    )
    dispatch(
      actions.changeFilter({
        type: TypeFilter.maxRent,
        data: null,
        notSearching: true,
      }),
    )
  }
  const marksRadius = valuesRadius.map(({ id, value }) => ({
    value: id,
    label: `${value} Km`,
  }))

  const marksLenght = valuesLength.map(({ id, value }) => ({
    value: id,
    label: `${value} ${t('FILTERS_LENGTH_VALUES')}`,
  }))

  const handleDateChange = (date: Date | null) => {
    if (date) {
      dispatch(
        actions.changeFilter({
          type: TypeFilter.when,
          data: date.toDateString(),
          notSearching: true,
        }),
      )
      analytics.event({
        category: 'List-filter-mobile',
        action: TypeFilter.when,
        data: date.toDateString(),
        ...GAUser,
      })
    }
  }
  const handleTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const data =
      event.target.value === SearchType.Fixed
        ? checked
          ? filteredType === SearchType.Flex
            ? SearchType.Both
            : SearchType.Fixed
          : filteredType === SearchType.Both
          ? SearchType.Flex
          : null
        : checked
        ? filteredType === SearchType.Fixed
          ? SearchType.Both
          : SearchType.Flex
        : filteredType === SearchType.Both
        ? SearchType.Fixed
        : null
    dispatch(
      actions.changeFilter({
        type: TypeFilter.type,
        data,
        notSearching: true,
      }),
    )
    analytics.event({
      category: 'List-filter-mobile',
      action: TypeFilter.type,
      data,
      ...GAUser,
    })
  }

  const valueLabelFormat = (newValue: number, values: Array<any>) =>
    get(
      values.find(val => val.id === newValue),
      'value',
    )
  const valueLabelFormatRadius = (newValue: number) =>
    valueLabelFormat(newValue, valuesRadius)
  const valueLabelFormatLength = (newValue: number) =>
    valueLabelFormat(newValue, valuesLength)

  const handleSliderChange = (
    newValue: number | Array<number>,
    type: TypeFilter,
    values: Array<any>,
  ) => {
    const data = get(
      values.find(val => val.id === newValue),
      'value',
    )
    dispatch(
      actions.changeFilter({
        type,
        data,
        notSearching: true,
      }),
    )

    analytics.event({
      category: 'List-filter-mobile',
      action: type,
      data,
      ...GAUser,
    })
  }

  const handleSliderChangeRadius = (
    _event: any,
    newValue: number | Array<number>,
  ) => handleSliderChange(newValue, TypeFilter.radius, valuesRadius)

  const handleSliderChangeLength = (
    _event: any,
    newValue: number | Array<number>,
  ) => handleSliderChange(newValue, TypeFilter.length, valuesLength)

  const handleSliderChangeMaxRent = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) =>
    dispatch(
      actions.changeFilter({
        type: TypeFilter.maxRent,
        data: event.target.value as string,
        notSearching: true,
      }),
    )

  return (
    <DialogStyled
      fullScreen
      open={open}
      onClose={onCloseModal}
      aria-labelledby="form-dialog-title">
      <DialogTitleStyled disableTypography id={'form-dialog-title'}>
        {t('FILTERS_SHOW_MOBILE')}
        <IconButton data-testid="CloseModalButton" onClick={onCloseModal}>
          <CloseIcon />
        </IconButton>
      </DialogTitleStyled>
      <DialogContentStyled>
        <SliderContainer>
          <LabelStyled>{t('FILTERS_RADIUS')}</LabelStyled>
          {valuesRadius && valuesRadius.length > 0 && (
            <SliderMaterialStyled
              marks={marksRadius}
              value={filteredRadiusId}
              step={1}
              min={1}
              max={valuesRadius.length}
              key="filters-slider-radius-key"
              id="Filters-slider-radius"
              getAriaValueText={valueLabelFormatRadius}
              valueLabelFormat={valueLabelFormatRadius}
              onChange={handleSliderChangeRadius}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
          )}
        </SliderContainer>
        <DatePickerContainer>
          <LabelStyled>{t('FILTERS_MOVE_IN_BY')}</LabelStyled>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePickerStyled
              disableToolbar
              autoOk
              emptyLabel={t('PLACE_HOLDER_DATE_FORMAT')}
              variant="inline"
              inputVariant="outlined"
              format="dd.MM.yyyy"
              margin="normal"
              id="date-picker-moveinby"
              name="filters-moveinby"
              value={
                filteredWhen && filteredWhen !== ''
                  ? new Date(filteredWhen)
                  : null
              }
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </DatePickerContainer>
        <SliderContainer>
          <LabelStyled>{t('FILTERS_LENGHT_MOBILE')}</LabelStyled>
          {valuesLength && valuesLength.length > 0 && (
            <SliderMaterialStyled
              marks={marksLenght}
              value={filteredLengthId}
              step={1}
              min={1}
              max={valuesLength.length}
              key="filters-slider-length-key"
              id="Filters-slider-length"
              getAriaValueText={valueLabelFormatLength}
              valueLabelFormat={valueLabelFormatLength}
              onChange={handleSliderChangeLength}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
          )}
        </SliderContainer>
        <ChecksContainer>
          <LabelStyled>{t('FILTERS_LEASE_TYPE')}</LabelStyled>
          <FormControlLabelStyled
            key="filters-checkbox-fixed"
            control={
              <Checkbox
                checked={
                  filteredType === SearchType.Fixed ||
                  filteredType === SearchType.Both
                }
                value={SearchType.Fixed}
                color="primary"
                onChange={handleTypeChange}
              />
            }
            label={t('FILTERS_LEASE_TYPE_FIXED')}
          />
          <FormControlLabelStyled
            key="filters-checkbox-flex"
            control={
              <Checkbox
                checked={
                  filteredType === SearchType.Flex ||
                  filteredType === SearchType.Both
                }
                value={SearchType.Flex}
                color="primary"
                onChange={handleTypeChange}
              />
            }
            label={t('FILTERS_LEASE_TYPE_FLEX')}
          />
        </ChecksContainer>
        <SliderContainer>
          <LabelStyled>{t('FILTERS_MAX_RENT')}</LabelStyled>
          {valuesMaxRent && valuesMaxRent.length > 0 && (
            <FormControl>
              <SelectStyled
                displayEmpty
                disableUnderline={true}
                labelId="demo-simple-select-label"
                data-testid={`FilterSelect-maxRent`}
                value={filteredMaxRent}
                MenuProps={{ MenuListProps: { disablePadding: true } }}
                onChange={handleSliderChangeMaxRent}>
                <MenuItemStyledFirst value="0"></MenuItemStyledFirst>
                {valuesMaxRent.map(({ id, value, title }) => (
                  <MenuItemStyled key={id} value={value}>
                    {title}
                  </MenuItemStyled>
                ))}
              </SelectStyled>
            </FormControl>
          )}
        </SliderContainer>
      </DialogContentStyled>
      <Line />
      <DialogActionsStyled>
        <ButtonClear
          data-testid="ClearModalButton"
          onClick={onClear}
          data-auto="click-filter-clear-search-mobile">
          {t('FILTERS_MODAL_CLEAR_ALL')}
        </ButtonClear>
        <ButtonApply
          data-testid="ApplyModalButton"
          onClick={onCloseModal}
          data-auto="click-filter-search-mobile">
          {t('FILTERS_MODAL_APPLY_FILTERS')}
        </ButtonApply>
      </DialogActionsStyled>
    </DialogStyled>
  )
}

export default FiltersModal
