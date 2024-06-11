import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { get } from 'lodash'
import moment from 'moment'

import useMediaQuery from '@material-ui/core/useMediaQuery'

import { SearchType, TypeFilter, FilterWhere } from 'services/search/types'
import selectors from 'services/search/selectors'
import actions from 'services/search/actions'
import Input from 'components/common/Input'
import DatePicker from 'components/common/DatePicker'
import device from 'services/global/device'
import { useWindowSize } from 'services/global/hooks'
import WhatsThis from './WhatsThis'
import Autocomplete from 'components/common/Autocomplete'

import userSelectors from 'services/user/selectors'
import Analytics from 'services/analytics'

const ButtonContainer = styled.div`
  display: flex;
`
const FlexContainer = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
`
/*
 * Mobile widget top:
 * widget height = 455px
 * SS nav bar = 50px
 * bottom margin = 20px
 * top = 100vh - 50px - 50px - 20px - 455px
 */
const CardContainer = styled.div<{ vh: string }>`
  margin: 50px 0 0 40px;
  padding: 20px;
  width: 339px;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.19);
  @media ${device.mobile} {
    width: calc(100vw - 60px);
    position: relative;
    top: calc(${props => props.vh} - 525px);
    margin: 0 10px;
  }
`
const TitleContainer = styled.h2`
  margin: 0;
  padding: 0 0 20px 0;
  color: #000000;
  font-size: 32px;
  font-weight: 300;
  line-height: 41px;
  width: 250px;
`
const InputWizard = styled(Input)`
  input {
    height: 41px;
  }
  label {
    color: #404042;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
  }
`
const InputHalfSizeWizard = styled(InputWizard)`
  width: 49%;
  padding-right: 10px;
`
const DatePickerHalfSizeWizard = styled(DatePicker)`
  width: 49%;
  padding-left: 10px;
  margin-top: 10px;
  label {
    color: #404042;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
  }
  input {
    color: #000000;
    font-size: 16px;
    font-weight: 400;
    height: 27px;
  }
`

const ButtonOption = styled.button<{
  selected: boolean
}>`
  background-color: transparent;
  color: ${props => (props.selected ? '#000000' : '#828286')};
  font-size: 16px;
  font-weight: 400;
  border: 1px solid ${props => (props.selected ? '#000000' : '#DFDFDF')};
  border-radius: 2px;
  outline: none;
  display: inline-block;
  padding: 10px;
  text-align: center;
  flex: auto;
  margin-left: -1px;
  margin-right: 0px;
  cursor: pointer;
  z-index: ${props => (props.selected ? '1' : '0')};
`
const ButtonSearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ButtonSearch = styled.button`
  border-radius: 4px;
  background-color: #f35c2b;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 10px 40px;
  float: right;
  margin-top: 30px;
  border: none;
  cursor: pointer;
`
const TypeTitle = styled.div`
  color: #404042;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 0 0 2px 10px;
`

const defaultLocation: { [domain: string]: FilterWhere } = {
  'spacespot.no': {
    location: 'Oslo',
    latLng: {
      lat: 59.9138688,
      lng: 10.7522454,
    },
  },
}

const Wizard = (props: { title: string; searchType?: SearchType }) => {
  const { title, searchType } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const filters = useSelector(selectors.searchFilters)
  const { desks, type, when, where } = filters
  const wBox = useWindowSize()
  const [minVH, setMinVH] = useState(0)
  const vh = minVH ? `${minVH}px` : '100vh'
  const isMobile = useMediaQuery(device.mobile)
  const GAUser = useSelector(userSelectors.getGAUser)

  useEffect(() => {
    if (!minVH && wBox.height) {
      setMinVH(wBox.height)
    }
  }, [wBox, minVH])

  useEffect(() => {
    const key = Object.keys(defaultLocation).find(domain =>
      window.location.hostname.endsWith(domain),
    )
    if (key) {
      const location = defaultLocation[key]
      dispatch(
        actions.changeFilter({
          type: TypeFilter.where,
          data: location,
          notSearching: true,
        }),
      )
      dispatch(
        actions.changeFilter({
          type: TypeFilter.radius,
          data: 20,
          notSearching: true,
        }),
      )
    }
  }, [dispatch])

  const [autocompleteLoaded, setAutocompleteLoaded] = useState(
    (undefined as unknown) as google.maps.places.Autocomplete,
  )
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteLoaded(autocomplete)
  }
  const changeFilter = (
    type: TypeFilter,
    data: string | number | SearchType | FilterWhere,
  ) => {
    dispatch(actions.changeFilter({ type, data, notSearching: true }))
    Analytics.event({
      category: searchType
        ? searchType === SearchType.Flex
          ? 'wizard-coworking'
          : 'wizard-offices'
        : 'wizard',
      action: `filter-${type}`,
      data,
      ...GAUser,
    })
  }

  const onPlaceChanged = () => {
    const place = autocompleteLoaded && autocompleteLoaded.getPlace()

    const location = get(place, 'geometry.location')
    const latLng = location
      ? { lat: location.lat(), lng: location.lng() }
      : undefined
    const formtattedAddress = get(place, 'formatted_address')
    if (formtattedAddress) {
      changeFilter(TypeFilter.where, {
        location: place.formatted_address as string,
        latLng: latLng,
      } as FilterWhere)
    }
  }

  const doSearch = () => {
    Analytics.pixel(Analytics.PIXELS.SEARCH)
    if (searchType) {
      changeFilter(TypeFilter.type, searchType)
    }
    dispatch(actions.searchInit())
  }

  return (
    <CardContainer vh={vh}>
      <TitleContainer>{title}</TitleContainer>
      <Autocomplete
        onLoad={onLoad}
        fields={['name', 'geometry.location', 'place_id', 'formatted_address']}
        onPlaceChanged={onPlaceChanged}>
        <InputWizard
          id="address"
          label={t('WIZARD_WHERE_QUESTION')}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            changeFilter(TypeFilter.where, {
              location: event.target.value,
            })
          }
          autoFocus={!isMobile}
          value={where && where.location ? where.location : ''}
          type="string"
          placeholder={t('WIZARD_PLACE_HOLDER_LOCATION')}
        />
      </Autocomplete>
      <FlexContainer>
        <InputHalfSizeWizard
          id="desks"
          label={t('WIZARD_DESKS_QUESTION')}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            changeFilter(TypeFilter.desks, Number(event.target.value))
          }}
          value={desks && desks > 0 ? desks : ''}
          min={1}
          type="number"
        />
        <DatePickerHalfSizeWizard
          id="when"
          format="dd.MM.yyyy"
          placeholder={t('PLACE_HOLDER_DATE_FORMAT')}
          label={t('WIZARD_WHEN_QUESTION')}
          value={
            when && when !== '' && /^\d{2}\/\d{2}\/\d{4}$/.test(when)
              ? moment(when, 'MM/DD/YYYY').toDate()
              : null
          }
          disablePast={true}
          onChange={e =>
            changeFilter(
              TypeFilter.when,
              e ? (moment(e, 'DD/MM/YYYY').format('MM/DD/YYYY') as string) : '',
            )
          }
        />
      </FlexContainer>
      {!searchType && (
        <>
          <FlexContainer>
            <TypeTitle>{t('WIZARD_TYPE')}</TypeTitle>
            <WhatsThis />
          </FlexContainer>
          <ButtonContainer>
            <ButtonOption
              onClick={() => changeFilter(TypeFilter.type, SearchType.Fixed)}
              selected={type === SearchType.Fixed}>
              {t('WIZARD_STANDARD_FIXED')}
            </ButtonOption>
            <ButtonOption
              onClick={() => changeFilter(TypeFilter.type, SearchType.Flex)}
              selected={type === SearchType.Flex}>
              {t('WIZARD_MONTHLY_FLEX')}
            </ButtonOption>
            <ButtonOption
              onClick={() => changeFilter(TypeFilter.type, SearchType.Both)}
              selected={type === SearchType.Both}>
              {t('WIZARD_BOTH')}
            </ButtonOption>
          </ButtonContainer>
        </>
      )}
      <ButtonSearchContainer>
        <ButtonSearch
          onClick={() => doSearch()}
          data-auto={
            searchType
              ? searchType === SearchType.Flex
                ? 'wizard-coworking-search'
                : 'wizard-offices-search'
              : 'wizard-search'
          }>
          {t('WIZARD_SEARCH')}
        </ButtonSearch>
      </ButtonSearchContainer>
    </CardContainer>
  )
}

export default Wizard
