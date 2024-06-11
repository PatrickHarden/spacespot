import React from 'react'
import { useIntl } from 'react-intl'
import { get } from 'lodash'

import { Space } from 'services/space/types'
import { getCountry, getFlexAvailability } from 'services/space/selectors'
import SpaceDetail from './SpaceDetail'
import { getRegionCurrencyCode } from 'services/global/region'
import { EnquiryType } from 'services/enquiry/types'
import Spinner from 'components/icons/Spinner'
import { AvailabilityFlex } from 'services/onboarding/types'

const getServiceOffice = (
  servicedOffices: Array<AvailabilityFlex>,
  flexIdentifier: number,
) => {
  let result = {}
  servicedOffices.forEach(servicedOffice => {
    if (servicedOffice.id === flexIdentifier.toString()) {
      result = servicedOffice
    }
  })

  return result
}

const FlexSpaceDetail = (props: {
  space: Space
  type?: EnquiryType
  flexIdentifier?: number
}) => {
  const { space, type, flexIdentifier } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  const currencyCode = getRegionCurrencyCode(getCountry(space))

  if (!space) {
    return <Spinner />
  }
  switch (type) {
    case EnquiryType.HotDesk: {
      const hotDesks = getFlexAvailability(space, 'HotDesk') as AvailabilityFlex
      return (
        <SpaceDetail
          quantityLabel={t('YOUR_ENQUIRIES_HOT_DESKS')}
          quantityValue={get(hotDesks, 'desks', 0).toString()}
          availability={get(hotDesks, 'availableFrom')}
          rent={get(hotDesks, 'price')}
          currencyCode={currencyCode}
        />
      )
    }
    case EnquiryType.FixedDesk: {
      const fixedDesks = getFlexAvailability(
        space,
        'FixedDesk',
      ) as AvailabilityFlex
      return (
        <SpaceDetail
          quantityLabel={t('YOUR_ENQUIRIES_FIXED_DESKS')}
          quantityValue={get(fixedDesks, 'desks', 0).toString()}
          availability={get(fixedDesks, 'availableFrom')}
          rent={get(fixedDesks, 'price')}
          currencyCode={currencyCode}
        />
      )
    }
    case EnquiryType.ServicedOffice:
    default: {
      const servicedOffices = getFlexAvailability(
        space,
        'ServicedOffice',
      ) as Array<AvailabilityFlex>
      const serviceOffice = getServiceOffice(
        servicedOffices,
        flexIdentifier as number,
      )
      return (
        <SpaceDetail
          quantityLabel={t('YOUR_ENQUIRIES_SERVICED_OFFICE')}
          quantityValue={`${get(serviceOffice, 'desks', 0).toString()} ${t(
            'DETAILS_SERVICED_OFFICES_PEOPLE',
          )}`}
          availability={get(serviceOffice, 'availableFrom')}
          rent={get(serviceOffice, 'price')}
          currencyCode={currencyCode}
        />
      )
    }
  }
}

export default FlexSpaceDetail
