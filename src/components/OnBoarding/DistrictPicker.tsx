import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Dropdown, { Option, Header } from 'components/common/Dropdown'
import { getDistricts, DistrictItem } from 'services/district/api'
import userSelectors from 'services/user/selectors'

const SDropdown = styled(Dropdown)`
  flex: 1;
  margin-top: 20px;
  padding-right: 20px;
`
const SOption = styled(Option)`
  padding-left: 30px;
`

export interface DistrictChange {
  id: number
  district: string
  subdistrict: string
}

const fetchDistricts = async (
  token: string,
  country: string,
  city: string,
  setData: (data: any) => void,
  setChangeLUT: (lut: any) => void,
  value: string,
  onChange?: any,
) => {
  const resp = await getDistricts(token, country, city)
  setData(resp)
  const changes: { [key: string]: DistrictChange } = {}
  resp.forEach(item => {
    item.subdistrict.forEach(sub => {
      changes[sub.name] = {
        id: sub.id,
        district: item.district,
        subdistrict: sub.name,
      }
    })
  })
  setChangeLUT(changes)

  if (onChange && value && value !== '') {
    onChange(changes[value])
  }
}

const DistrictPicker = (props: {
  id?: string
  label?: string
  city?: string
  country?: string
  value: string
  error?: string
  onChange?: (e: DistrictChange) => void
}) => {
  const { id, value, error, onChange, label, city, country } = props
  const [data, setData] = useState((null as unknown) as Array<DistrictItem>)
  const [changeLUT, setChangeLUT] = useState(
    (null as unknown) as { [key: string]: DistrictChange },
  )
  const token: string = useSelector(userSelectors.token)
  useEffect(() => {
    if (city && country) {
      fetchDistricts(
        token,
        country,
        city,
        setData,
        setChangeLUT,
        value,
        onChange,
      )
    }
  }, [token, city, country])

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const subdistrict = e.target.value as string
    if (onChange) {
      onChange(changeLUT[subdistrict])
    }
  }

  if (!data || !data.length) {
    return null
  }

  return (
    <SDropdown
      id={id}
      label={label}
      onChange={handleChange}
      value={changeLUT && changeLUT[value] ? value : ''}
      error={error}>
      {data &&
        data.map(item => {
          const items = [<Header key={item.district}>{item.district}</Header>]
          const options = item.subdistrict.map(option => (
            <SOption value={option.name} key={option.id}>
              {option.name}
            </SOption>
          ))
          return items.concat(options)
        })}
    </SDropdown>
  )
}

export default DistrictPicker
