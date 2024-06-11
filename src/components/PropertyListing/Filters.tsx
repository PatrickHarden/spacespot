import React, { useState } from 'react'
import { get } from 'lodash'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import Autocomplete from 'components/common/Autocomplete'
import Input from 'components/common/Input'
import Lens from 'components/icons/Lens'
import Pin from 'components/icons/Pin'
import List from 'components/icons/List'

import { TypeFilter, SearchType, FilterWhere } from 'services/search/types'
import selectors from 'services/search/selectors'
import actions from 'services/search/actions'
import {
  valuesRadius,
  valuesLength,
  valuesMaxRent,
} from 'services/search/filters'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import device from 'services/global/device'
import FiltersModal from './FiltersModal'

import userSelectors from 'services/user/selectors'
import analytics from 'services/analytics'

const Container = styled.div`
  border-bottom: solid 1px #ddd;
  display: flex;
  flex-direction: row;
  height: 65px;
  display: flex;
  justify-content: left;
  align-items: center;
`
const Chip = styled.div<{ selected?: boolean; hasIcon?: boolean }>`
  position: relative;
  box-sizing: border-box;
  width: auto;
  text-align: center;
  border: ${props =>
    props.selected ? `2px solid #404042` : `1px solid #DDDDDD;`};
  border-radius: 20px;
  cursor: pointer;
  padding: 6px 14px 6px ${props => (props.hasIcon ? '35px' : '14px')};
  margin-right: 10px;
  font: 16px 400 #404042;
  &:hover {
    background-color: #f4f4f4;
    border-radius: 20px;
  }
  @media ${device.mobile} {
    max-width: 157px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`

const OverlayDesksContainerRelative = styled.div`
  width: 199px;
  padding-right: 10px;
  position: relative;
`
const OverlayDesksContainer = styled.div`
  position: absolute;
  top: -15px;
  left: 0;
  height: 173px;
  width: 199px;
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
`
const OverlayDesksTitle = styled.div`
  padding: 5px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 2px 2px 0 0;
  background-color: #f4f4f4;

  color: #404042;
  font-size: 16px;
  font-weight: 500;
`
const OverlayDesksInputContainer = styled.div`
  padding: 15px;
  margin-top: 10px;
`
const OverlayDesksText = styled.div`
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 18px;
`
const InputDesks = styled(Input)`
  margin-top: 0;
`
const OverlayButtonSave = styled.button`
  border-radius: 2px;
  background-color: #404042;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  float: right;
  padding: 6px 20px;
  margin-right: 17px;
`
const FilterGoogleInput = styled(Input)`
  flex-grow: 3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
  padding-right: 10px;
  width: 370px;
  @media ${device.mobile} {
    width: 157px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  :focus {
    border-radius: 2px 2px 0 0;
  }
`
const LensIcon = styled(Lens)`
  position: absolute;
  top: 7px;
  left: 10px;
  height: 20px;
  width: 20px;
`

const SelectStyled = styled(Select)<{ selected?: boolean }>`
  margin-right: 10px;

  & .MuiInputBase-input {
    font-size: 16px;
    font-weight: 400;
    color: #404042;
    border-radius: 20px;
    text-align: center;
    border: ${props =>
      props.selected ? `2px solid #404042` : `1px solid #DDDDDD;`};
    padding: 8px 10px;
    text-align: center;
  }
  & svg {
    display: none;
  }
  &:hover {
    background-color: #f4f4f4;
    border-radius: 20px;
  }
  & .MuiSelect-select:focus {
    border-radius: 20px;
  }
  .MuiSelect-select.MuiSelect-select {
    padding: 8px;
  }
  .MuiList-padding {
    padding-top: 0;
    padding-bottom: 0;
  }
  padding: 0px;
`
const MenuItemStyled = styled(MenuItem)`
  font-size: 16px;
`
const MenuItemStyledFirst = styled(MenuItem)`
  font-size: 16px;
  font-weight: 500;
`
const FilterDateStyled = styled(DatePicker)<{ selected?: boolean }>`
  &:hover {
    background-color: #f4f4f4;
    border-radius: 20px;
  }
  & .MuiSelect-select:focus {
    background-color: #f4f4f4;
  }
  .MuiInputBase-input {
    font-size: 16px;
    font-weight: 400;
    color: #404042;
    border-radius: 20px;
    text-align: center;
    border: ${props =>
      props.selected ? `2px solid #404042` : `1px solid #DDDDDD;`};
    padding: 8px 10px;
    cursor: pointer;
  }
  & .MuiInput-underline:before,
  .MuiInput-underline:after,
  .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: white;
  }
  margin-right: 10px;
  width: ${props => (props.selected ? `130px` : `100px`)};
  padding: 0px;
`
const PinStyled = styled(Pin)`
  position: absolute;
  right: 10px;
`
const ListStyled = styled(List)`
  position: absolute;
  right: 10px;
`

export interface FiltersProps {
  className?: string
  onToggleClick?: () => void
  showMap?: boolean
}
const Filters = ({ className, showMap, onToggleClick }: FiltersProps) => {
  const dispatch = useDispatch()

  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const filteredWhere = useSelector(selectors.searchFiltersWhere)
  const filteredDesks = useSelector(selectors.searchFiltersDesks)
  const filteredRadius = useSelector(selectors.searchFiltersRadius)
  const filteredWhen = useSelector(selectors.searchFiltersWhen)
  const filteredLength = useSelector(selectors.searchFiltersLength)
  const filteredType =
    useSelector(selectors.searchFiltersType) || SearchType.None
  const filteredMaxRent = useSelector(selectors.searchFiltersMaxRent)
  const GAUser = useSelector(userSelectors.getGAUser)

  const [openModal, setOpenModal] = useState(false)
  const [showFilter, setShowFilter] = useState(
    undefined as TypeFilter | undefined,
  )

  const handleClickModalFilter = () => {
    setOpenModal(!openModal)
  }

  const [autocompleteLoaded, setAutocompleteLoaded] = useState(
    (undefined as unknown) as google.maps.places.Autocomplete,
  )
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteLoaded(autocomplete)
  }

  const onPlaceChanged = () => {
    const place = autocompleteLoaded && autocompleteLoaded.getPlace()
    const location = get(place, 'geometry.location')
    const latLng = location
      ? { lat: location.lat(), lng: location.lng() }
      : undefined
    const formtattedAddress = get(place, 'formatted_address')
    if (formtattedAddress) {
      dispatch(
        actions.changeFilter({
          type: TypeFilter.where,
          data: {
            location: formtattedAddress,
            latLng: { lat: get(latLng, 'lat'), lng: get(latLng, 'lng') },
          } as FilterWhere,
        }),
      )
      analytics.event({
        category: 'List-filter',
        action: 'where-latLng',
        data: {
          location: formtattedAddress,
          latLng: { lat: get(latLng, 'lat'), lng: get(latLng, 'lng') },
        },
        ...GAUser,
      })
    } else {
      const name = get(place, 'name')
      if (name) {
        dispatch(
          actions.changeFilter({
            type: TypeFilter.where,
            data: {
              location: name,
            } as FilterWhere,
          }),
        )
        analytics.event({
          category: 'List-filter',
          action: 'where-location',
          data: {
            location: name,
          },
          ...GAUser,
        })
      }
    }
    setShowFilter(undefined)
  }

  const onChangeWhere = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(
      actions.changeFilter({
        type: TypeFilter.where,
        data: {
          location: event.target.value,
        },
        notSearching: true,
      }),
    )
  const onChangeWhereBlur = () => {
    dispatch(
      actions.changeFilter({
        type: TypeFilter.where,
        data: {
          location: filteredWhere,
        },
      }),
    )
    analytics.event({
      category: 'List-filter',
      action: 'where-location-blur',
      data: {
        location: filteredWhere,
      },
      ...GAUser,
    })

    setTimeout(() => setShowFilter(undefined), 1000)
  }
  const onChangeDesks = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      actions.changeFilter({
        type: TypeFilter.desks,
        data: Number(event.target.value),
        notSearching: true,
      }),
    )
    analytics.event({
      category: 'List-filter',
      action: 'desks',
      data: Number(event.target.value),
      ...GAUser,
    })
  }

  const handleChange = (data: string, type: TypeFilter) => {
    dispatch(
      actions.changeFilter({
        type,
        data,
        notSearching: type !== TypeFilter.radius && type !== TypeFilter.type,
      }),
    )
    analytics.event({
      category: 'List-filter',
      action: type,
      data,
      ...GAUser,
    })
  }
  const IsMobile = useMediaQuery(device.mobile)

  return (
    <Container className={className}>
      {showFilter !== TypeFilter.where ? (
        <Chip
          selected={Boolean(filteredWhere && filteredWhere !== '')}
          hasIcon={true}
          onClick={() => setShowFilter(TypeFilter.where)}>
          {filteredWhere && filteredWhere !== ''
            ? filteredWhere
            : t('FILTERS_WHERE')}
          <LensIcon />
        </Chip>
      ) : (
        <Autocomplete
          onLoad={onLoad}
          fields={[
            'name',
            'geometry.location',
            'place_id',
            'formatted_address',
          ]}
          onPlaceChanged={onPlaceChanged}>
          <FilterGoogleInput
            id="googleMapsFilter"
            type="string"
            onChange={onChangeWhere}
            onBlur={onChangeWhereBlur}
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                onChangeWhereBlur()
              }
            }}
            value={filteredWhere}
            autoFocus={true}
            placeholder={t('GOOGLEINPUT_FILTER_PLACE_HOLDER_LOCATION')}
          />
        </Autocomplete>
      )}
      {showFilter !== TypeFilter.desks ? (
        <Chip
          selected={Boolean(filteredDesks && filteredDesks !== 0)}
          onClick={() => setShowFilter(TypeFilter.desks)}>
          {filteredDesks && filteredDesks !== 0
            ? `${filteredDesks} ${t('FILTERS_DESKS')}`
            : t('FILTERS_DESKS')}
        </Chip>
      ) : (
        <OverlayDesksContainerRelative>
          <OverlayDesksContainer>
            <OverlayDesksTitle>
              {t('FILTERS_DESKS_OVERLAY_TITLE')}
            </OverlayDesksTitle>
            <OverlayDesksInputContainer>
              <OverlayDesksText>
                {t('FILTERS_DESKS_OVERLAY_TEXT')}
              </OverlayDesksText>
              <InputDesks
                type="number"
                id="filter-desks"
                value={
                  !filteredDesks || filteredDesks === 0 ? '' : filteredDesks
                }
                autoFocus={true}
                onChange={onChangeDesks}
                onBlur={() => setShowFilter(undefined)}
              />
            </OverlayDesksInputContainer>
            <OverlayButtonSave>
              {t('FILTERS_DESKS_OVERLAY_SAVE')}
            </OverlayButtonSave>
          </OverlayDesksContainer>
        </OverlayDesksContainerRelative>
      )}
      {!IsMobile ? (
        <>
          <FormControl>
            <SelectStyled
              selected={Boolean(filteredRadius && filteredRadius !== 0)}
              displayEmpty
              disableUnderline={true}
              labelId="demo-simple-select-label"
              data-testid={`FilterSelect-radius`}
              value={filteredRadius}
              MenuProps={{ MenuListProps: { disablePadding: true } }}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                handleChange(event.target.value as string, TypeFilter.radius)
              }>
              <MenuItemStyledFirst value="0">
                {t('FILTERS_RADIUS')}
              </MenuItemStyledFirst>
              {valuesRadius.map(({ id, value }) => (
                <MenuItemStyled key={id} value={value}>
                  {`${value} Km`}
                </MenuItemStyled>
              ))}
            </SelectStyled>
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <FilterDateStyled
              data-testid="date-picker-when"
              variant="inline"
              autoOk
              disableToolbar
              disablePast={true}
              selected={Boolean(filteredWhen && filteredWhen !== '')}
              emptyLabel={t('FILTERS_MOVE_IN_BY')}
              format="dd.MM.yyyy"
              id="date-picker-inline"
              value={
                filteredWhen && filteredWhen !== ''
                  ? new Date(filteredWhen)
                  : null
              }
              onChange={(date: Date | null) => {
                if (date && date instanceof Date) {
                  handleChange(
                    moment(date).format('MM/DD/YYYY'),
                    TypeFilter.when,
                  )
                } else {
                  handleChange('', TypeFilter.when)
                }
              }}
            />
          </MuiPickersUtilsProvider>
          <FormControl>
            <SelectStyled
              selected={Boolean(filteredLength && filteredLength > 0)}
              displayEmpty
              disableUnderline={true}
              labelId="demo-simple-select-label"
              data-testid={`FilterSelect-radius`}
              value={filteredLength}
              MenuProps={{ MenuListProps: { disablePadding: true } }}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                handleChange(event.target.value as string, TypeFilter.length)
              }>
              <MenuItemStyledFirst value="0">
                {t('FILTERS_LENGTH')}
              </MenuItemStyledFirst>
              {valuesLength.map(({ id, value, title }) => (
                <MenuItemStyled key={id} value={value}>
                  {`${title} ${t('FILTERS_LENGTH_VALUES')}`}
                </MenuItemStyled>
              ))}
            </SelectStyled>
          </FormControl>
          <FormControl>
            <SelectStyled
              selected={
                Boolean(filteredType) && filteredType !== SearchType.None
              }
              displayEmpty
              disableUnderline={true}
              labelId="demo-simple-select-label"
              data-testid={`FilterSelect-leaseType`}
              value={filteredType}
              MenuProps={{ MenuListProps: { disablePadding: true } }}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                handleChange(event.target.value as string, TypeFilter.type)
              }>
              <MenuItemStyledFirst value={SearchType.None}>
                {t('FILTERS_LEASE_TYPE')}
              </MenuItemStyledFirst>
              <MenuItemStyled key={1} value={SearchType.Fixed}>
                {t('FILTERS_LEASE_TYPE_FIXED')}
              </MenuItemStyled>
              <MenuItemStyled key={2} value={SearchType.Flex}>
                {t('FILTERS_LEASE_TYPE_FLEX')}
              </MenuItemStyled>
              <MenuItemStyled key={3} value={SearchType.Both}>
                {t('FILTERS_LEASE_TYPE_BOTH')}
              </MenuItemStyled>
            </SelectStyled>
          </FormControl>
          <FormControl>
            <SelectStyled
              selected={Boolean(filteredMaxRent && filteredMaxRent > 0)}
              displayEmpty
              disableUnderline={true}
              labelId="demo-simple-select-label"
              data-testid={`FilterSelect-maxRent`}
              value={filteredMaxRent}
              MenuProps={{ MenuListProps: { disablePadding: true } }}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                handleChange(event.target.value as string, TypeFilter.maxRent)
              }>
              <MenuItemStyledFirst value="0">
                {t('FILTERS_MAX_RENT')}
              </MenuItemStyledFirst>
              {valuesMaxRent.map(({ id, value, title }) => (
                <MenuItemStyled key={id} value={value}>
                  {title}
                </MenuItemStyled>
              ))}
            </SelectStyled>
          </FormControl>
        </>
      ) : (
        <>
          <Chip
            selected={
              Boolean(filteredRadius && filteredRadius !== 0) ||
              Boolean(filteredWhen && filteredWhen !== '') ||
              Boolean(filteredLength && filteredLength !== 0) ||
              Boolean(filteredType) ||
              Boolean(filteredMaxRent && filteredMaxRent !== 0)
            }
            onClick={handleClickModalFilter}>
            {t('FILTERS_SHOW_MOBILE')}
          </Chip>
          {showMap ? (
            <ListStyled onClick={onToggleClick} />
          ) : (
            <PinStyled onClick={onToggleClick} />
          )}
          <FiltersModal open={openModal} onClose={handleClickModalFilter} />
        </>
      )}
    </Container>
  )
}

export default Filters
