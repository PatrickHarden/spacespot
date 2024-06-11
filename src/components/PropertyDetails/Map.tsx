import React from 'react'
import styled from 'styled-components'
import { GoogleMap, Marker } from '@react-google-maps/api'

import { Space } from 'services/space/types'
import { getLocation, getStreet } from 'services/space/helpers'
import { noPrerender, withGoogle } from 'components/common/hocs'
import DOMPurify from 'dompurify'
import analytics from 'services/analytics'
import selectors from 'services/user/selectors'
import { useSelector } from 'react-redux'

const Container = styled.div`
  margin: 0;
  h2 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 2px;
  }
  p {
    margin-top: 0px;
  }
`
const GMap = noPrerender(withGoogle(styled.div``))

const Map = (props: { className?: string; space: Space; building: Space }) => {
  const { space, building } = props
  const location = DOMPurify.sanitize(getLocation(building))
  const address = getStreet(space)
  const GAUser = useSelector(selectors.getGAUser)
  const cords = space
    ? [
        {
          lat: space['Common.Coordinate'].lat,
          lng: space['Common.Coordinate'].lon,
        },
      ]
    : []

  return (
    <Container>
      <h2>{address}</h2>
      <p dangerouslySetInnerHTML={{ __html: location }} />
      <GMap>
        <GoogleMap
          center={cords[0]}
          mapContainerStyle={{
            height: '400px',
            width: '100%',
          }}
          zoom={14}
          onClick={() =>
            analytics.event({
              category: 'Details',
              action: 'Click-Map',
              ...GAUser,
            })
          }>
          {cords.map((item, index) => (
            <Marker key={index} position={item} />
          ))}
        </GoogleMap>
      </GMap>
    </Container>
  )
}

export default Map
//*[@id="root"]/div[2]/div[3]/div[1]/div/div[8]/div/div/div/div/iframe
