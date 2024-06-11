import React from 'react'
import { useSelector } from 'react-redux'

import PropertyDetailsLayout from 'components/PropertyDetails/PropertyDetailsLayout'
import spaceSelectors from 'services/space/selectors'

const SpaceDetails = () => {
  const space = useSelector(spaceSelectors.selectedSpace)
  const parent = useSelector(spaceSelectors.parentSpace)
  const regionAmenities = useSelector(spaceSelectors.regionAmenities)

  return (
    <PropertyDetailsLayout
      space={space}
      parent={parent}
      regionAmenities={regionAmenities}
      isEnquiry={false}
    />
  )
}

export default SpaceDetails
