/*global google */
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { get } from 'lodash'
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from '@react-google-maps/api'

import Input from 'components/common/Input'
import Heading3 from 'components/common/Heading3'
import device from 'services/global/device'
import CONFIG from 'config'

import DistrictPicker, { DistrictChange } from './DistrictPicker'
import RichTextArea from 'components/common/RichTextArea'

const Title = styled(Heading3)`
  margin-bottom: 0;
`
const Container = styled.div`
  display: flex;
  margin-bottom: 50px;
`
const ContainerFlex = styled.div`
  width: 100%;
  min-width: 300px;
`
const ContainerMap = styled.div`
  padding: 90px 0 0 20px;
  width: 100%;
  min-width: 360px;
  @media ${device.mobile} {
    display: none;
  }
`

const ContainerTwoInputs = styled.div`
  width: 100%;
  display: flex;
`

const InputFullWidth = styled(Input)`
  width: 100%;
  margin-top: 20px;
`

const InputHalf = styled(Input)<{ isRight?: boolean }>`
  flex: 1;
  padding-left: ${props => (props.isRight ? '20px' : '0')};
  margin-top: 20px;
`

const Fill = styled.div`
  flex: 1;
  width: 100;
`

export interface BuildingFormFields {
  location: string
  address: string
  city: string
  postCode: string
  latLng?: { lat: number; lng: number }
  country: string
  district: string
  subdistrict: {
    id: number
    name: string
  }
}

const BuildingDetailsForm = (props: {
  fields: BuildingFormFields
  setFields: React.Dispatch<React.SetStateAction<BuildingFormFields>>
  errors: { [key: string]: string }
}) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { fields, setFields, errors } = props
  const [autocompleteLoaded, setAutocompleteLoaded] = useState(
    (undefined as unknown) as google.maps.places.Autocomplete,
  )
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteLoaded(autocomplete)
  }
  const { isLoaded } = useLoadScript({
    googleMapsClientId: CONFIG.GOOGLE_MAPS_CLIENT,
    channel: CONFIG.GOOGLE_MAPS_CHANNEL,
    // @ts-ignore
    libraries: CONFIG.GOOGLE_MAPS_LIBS,
  })

  const onPlaceChanged = () => {
    const newFields = { ...fields }
    const place = autocompleteLoaded && autocompleteLoaded.getPlace()
    const location = get(place, 'geometry.location')
    const latLng = location
      ? { lat: location.lat(), lng: location.lng() }
      : undefined
    newFields.latLng = latLng
    const formattedAddress = get(place, 'formatted_address', '')
    newFields.address = formattedAddress
    const addressComponents = get(place, 'address_components')
    newFields.postCode = ''
    newFields.city = ''
    if (addressComponents) {
      addressComponents.forEach(
        (element: google.maps.GeocoderAddressComponent) => {
          if (
            element.types.includes('postal_code') ||
            element.types.includes('postl_code_prefix')
          ) {
            newFields.postCode = element.long_name
          }
          if (element.types.includes('country')) {
            newFields.country = element.short_name
          }
          if (
            element.types.includes('locality') ||
            element.types.includes('postal_town')
          ) {
            newFields.city = element.long_name
          }
        },
      )
    }
    setFields(newFields)
  }

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value
    setFields(prev => {
      return { ...prev, [field]: val }
    })
  }
  const handleQuillChange: (content: string) => void = (content: string) =>
    setFields({ ...fields, location: content })

  const handleDistrictChange = (e: DistrictChange) => {
    if (e) {
      setFields(prev => {
        return {
          ...prev,
          district: e.district,
          subdistrict: {
            id: e.id,
            name: e.subdistrict,
          },
        }
      })
    }
  }

  return (
    <Container>
      <ContainerFlex>
        <Title>{t('ONBOARDING_BUILDING_LOCATION')}</Title>
        {isLoaded && (
          <Autocomplete
            onLoad={onLoad}
            fields={[
              'name',
              'geometry.location',
              'place_id',
              'formatted_address',
              'address_components',
            ]}
            onPlaceChanged={onPlaceChanged}>
            <InputFullWidth
              type="text"
              id="address"
              label={t('ONBOARDING_ADDRESS')}
              onChange={handleChange('address')}
              placeholder={t('ONBOARDING_PLACEHOLDER_ADDRESS')}
              value={fields.address}
              error={errors.address}
            />
          </Autocomplete>
        )}
        <ContainerTwoInputs>
          <InputHalf
            type="text"
            id="city"
            label={t('ONBOARDING_CITY')}
            onChange={handleChange('city')}
            value={fields.city}
            error={errors.city}
          />
          <InputHalf
            isRight={true}
            type="text"
            id="postCode"
            label={t('ONBOARDING_POSTCODE')}
            onChange={handleChange('postCode')}
            value={fields.postCode}
            error={errors.postCode}
          />
        </ContainerTwoInputs>
        <ContainerTwoInputs>
          <DistrictPicker
            id="district"
            label={t('ONBOARDING_DISTRICT_LABEL')}
            city={fields.city}
            country={fields.country}
            onChange={handleDistrictChange}
            value={fields.subdistrict.name}
            error={errors.subdistrict}
          />
          <Fill />
        </ContainerTwoInputs>
        <RichTextArea
          id="location"
          label={t('ONBOARDING_LOCATION')}
          onChange={handleQuillChange}
          placeholder={t('ONBOARDING_PLACEHOLDER_LOCATION')}
          value={fields.location}
          error={errors.location}
          rows={4}
        />
      </ContainerFlex>
      <ContainerMap>
        {fields.latLng && isLoaded ? (
          <GoogleMap
            center={fields.latLng}
            mapContainerStyle={{
              height: '400px',
              width: '100%',
            }}
            zoom={14}>
            <Marker position={fields.latLng} />
          </GoogleMap>
        ) : null}
      </ContainerMap>
    </Container>
  )
}
export default BuildingDetailsForm
