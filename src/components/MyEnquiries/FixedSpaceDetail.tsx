import React from 'react'
import { useIntl } from 'react-intl'
import { get } from 'lodash'

import { Space } from 'services/space/types'
import { getCountry, getSpaceRent } from 'services/space/selectors'
import { getSize } from 'services/space/helpers'
import SpaceDetail from './SpaceDetail'
import {
  getRegionSizeDesc,
  getRegionCurrencyCode,
} from 'services/global/region'

const FixedSpaceDetail = (props: { space: Space }) => {
  const { space } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  const sizeUnits = getRegionSizeDesc(getCountry(space))
  const currencyCode = getRegionCurrencyCode(getCountry(space))
  const size = getSize(space)
  const availabilityFixed = new Date(get(space, 'Common.AvailableFrom', ''))
  const rent = getSpaceRent(space) || 0

  return (
    <SpaceDetail
      quantityLabel={t('YOUR_ENQUIRIES_SIZE')}
      quantityValue={`${size} ${sizeUnits}`}
      availability={availabilityFixed}
      rent={rent}
      currencyCode={currencyCode}
    />
  )
}

export default FixedSpaceDetail
