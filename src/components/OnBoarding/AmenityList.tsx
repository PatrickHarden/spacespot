import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { cloneDeep } from 'lodash'

import { AmenityOptions } from 'services/onboarding/types'
import actions from 'services/onboarding/actions'
import selectors from 'services/onboarding/selectors'
import CheckBox from 'components/common/CheckBox'
import { getUserIntl } from 'intl'

const AmenityList = styled(
  (props: { className?: string; amenities: AmenityOptions }) => {
    const { className, amenities } = props
    const options = useSelector(selectors.defaultAmenities)
    const dispatch = useDispatch()

    const list: AmenityOptions = Object.keys(amenities).reduce(
      (obj: AmenityOptions, key) => {
        obj[key] = amenities[key]
        return obj
      },
      options ? cloneDeep(options) : {},
    )

    useEffect(() => {
      if (!options) {
        dispatch(actions.initDefaultAmenities())
      }
    }, [dispatch, options])

    const onChange = (key: string) => (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const newAmenities = { ...list }
      newAmenities[key].checked = event.target.checked
      dispatch(actions.setAmenities(newAmenities))
    }

    const intl = getUserIntl()

    return (
      <div className={className}>
        {Object.keys(list).map(i => {
          return (
            <CheckBox onChange={onChange(i)} key={i} checked={list[i].checked}>
              {intl.formatMessage({ id: i.toUpperCase() })}
            </CheckBox>
          )
        })}
      </div>
    )
  },
)`
  min-height: 100px;
  margin-left: 10px;
  label {
    color: #828286;
  }
`

export default AmenityList
