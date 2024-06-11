import React from 'react'
import { get } from 'lodash'
import styled from 'styled-components'
import check from 'assets/icons/check.svg'

import { Space } from 'services/space/types'
import { aspects2Amenities } from 'services/onboarding/helpers'
import { AmenityOptions } from 'services/onboarding/types'
import { getUserIntl } from 'intl'

const Container = styled.div`
  margin: 0;
  ul {
    padding: 0 15px;
  }
  li {
    list-style-image: url(${check});
  }
`
const Amenities = (props: {
  className?: string
  building: Space
  regionAmenities: AmenityOptions
}) => {
  const { className, building, regionAmenities } = props
  const aspects = get(building, 'Common.Aspects', [])
  const amenities = aspects2Amenities(regionAmenities, aspects)
  const intl = getUserIntl()

  return (
    <Container className={className} data-auto="details-ammenities">
      <ul>
        {Object.keys(amenities || {})
          .filter(i => amenities[i].checked)
          .map(i => {
            return (
              <li key={i}>{intl.formatMessage({ id: i.toUpperCase() })}</li>
            )
          })}
      </ul>
    </Container>
  )
}

export default Amenities
