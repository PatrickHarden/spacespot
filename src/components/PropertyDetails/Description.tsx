import React from 'react'
import styled from 'styled-components'
import { get } from 'lodash'
import { useIntl } from 'react-intl'

import { Space } from 'services/space/types'
import { getImages, getFloorPlans } from 'services/space/helpers'
import { toSpaceData } from 'services/space/selectors'
import DetailsFixed from './DetailsFixed'
import DetailsFlex from './DetailsFlex'
import Photos from './Photos'
import Map from './Map'
import Amenities from './Amenities'
import spot from 'assets/icons/spot.svg'
import { AmenityOptions } from 'services/onboarding/types'
import { isSpaceFlex } from 'services/onboarding/utils'
import { Heading1 } from 'components/common/Heading1'
import { Heading2 } from 'components/common/Heading2'
import l360 from 'assets/icons/360-degrees.svg'
import flooredLogo from 'assets/icons/floored.svg'
import HTMLContent from 'components/common/HTMLContent'

const Container = styled.div`
  margin: 0;
  min-height: 800px;
`
const Header = styled(Heading1)`
  margin-top: 0;
  ::before {
    // Fix anchor offset with fixed nav
    content: ' ';
    display: block;
    margin-top: -50px;
    height: 50px;
    visibility: hidden;
  }
`

const Title = styled(Heading2)`
  border-bottom: 1px solid #ddd;
  margin: 40px 0 0 0;
  ::before {
    // Fix anchor offset with fixed nav
    content: ' ';
    display: block;
    margin-top: -50px;
    height: 50px;
    visibility: hidden;
  }
`

const Address = styled.div`
  color: #000000;
  font-size: 16px;
  line-height: 19px;
`

const Text = styled.div`
  color: #000000;
  font-size: 16px;
  line-height: 19px;
  margin: 10px 0;
`

const SeeMap = styled.div`
  h5 {
    margin: 5px 0;
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
  }
  img {
    margin-right: 4px;
  }
  a {
    text-decoration: none;
    color: #6cb9d5;
    display: flex;
    align-items: center;
  }
`

const Licensed = styled.h5`
  margin: 15px 0 5px 0;
  color: #828286;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
`

const Chip = styled.div`
  padding: 0 21px;
  margin-right: 5px;
  border-radius: 20px;
  background: #dddddd;
  display: inline-block;
  text-transform: lowercase;
`

const Logo360 = styled(
  (props: {
    className?: string
    title: string
    logo: string
    link?: string
  }) => {
    const { className, logo, title, link } = props
    if (!link) return null
    return (
      <a
        className={className}
        href={link}
        target="_blank"
        rel="noopener noreferrer">
        <img src={l360} alt="360" />
        <h5>
          <b>3D</b> {title}
        </h5>
        <div>
          <h6>Powered by</h6>
          <img src={logo} alt="360" />
        </div>
      </a>
    )
  },
)`
  display: flex;
  color: unset;
  text-decoration: none;
  justify-content: space-between;
  cursor: pointer;
  margin: 15px 0;
  background: #f4f4f4;
  border: 1px solid #dddddd;
  max-width: 320px;
  padding: 5px 10px 5px 20px;
  h5 {
    font-size: 14px;
    font-weight: 500;
  }
  h6 {
    margin: 0;
    margin-top: 28px;
    color: #828286;
    font-size: 14px;
    font-weight: 300;
    line-height: 18px;
  }
  :hover {
    border: 1px solid #6cb9d5;
    box-shadow: 0 1px 4px 0 #6cb9d5;
  }
`
const Frame360 = styled.iframe`
  margin: 15px 0;
`

const Description = (props: {
  className?: string
  space: Space
  building: Space
  regionAmenities: AmenityOptions
}) => {
  const { space, building, regionAmenities } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const spaceData = toSpaceData(space)
  const isFlex = isSpaceFlex(spaceData)
  const images = [...getImages(space), ...getImages(building)]
  const floorPlans = getFloorPlans(space)
  const matterPort = get(space, 'Common.Walkthrough', '')
  const floored = get(space, 'Common.FlooredURL', '')

  const useChipMap: { [use: string]: Array<string> } = {
    OFFICE: [t('DETAILS_OFFICE')],
    RETAIL: [t('DETAILS_RETAIL')],
    OFFICE_RETAIL: [t('DETAILS_OFFICE'), t('DETAILS_RETAIL')],
  }
  const chips = useChipMap[spaceData.use] || []

  return (
    <Container>
      <Header id="summary">{spaceData.spaceName}</Header>
      <Address>{spaceData.address}</Address>
      <SeeMap>
        <a href="#location">
          <img src={spot} alt="spot" />
          <h5>{t('DETAILS_SEE_MAP')}</h5>
        </a>
      </SeeMap>
      <Text>
        <HTMLContent html={spaceData.spaceDescription} />
      </Text>
      <Licensed>{t('DETAILS_LICENSED_FOR')}</Licensed>
      {chips.map(s => (
        <Chip key={s}>{s}</Chip>
      ))}
      {isFlex ? (
        <DetailsFlex space={space} />
      ) : (
        <>
          <Title id="details">{t('DETAILS_DETAILS')}</Title>
          <DetailsFixed space={space} />{' '}
        </>
      )}
      <Title id="ammenities">{t('DETAILS_AMMENITIES')}</Title>
      <Amenities building={building} regionAmenities={regionAmenities} />
      {matterPort && (
        <>
          <Title id="virtualtour">{t('DETAILS_VIRTUAL_TOUR')}</Title>
          <Frame360
            width="100%"
            height="480"
            src={matterPort}
            frameBorder="0"
            allowFullScreen
            allow="xr-spatial-tracking"></Frame360>
        </>
      )}
      <Title id="photos">{t('DETAILS_PHOTOS')}</Title>
      <Photos images={images} />
      {floorPlans.length > 0 && (
        <>
          <Title id="floorplan">{t('DETAILS_FLOORPLAN')}</Title>
          <Logo360 logo={flooredLogo} title="FLOORPLAN" link={floored} />
          <Photos images={floorPlans} />
        </>
      )}
      <Title id="location">{t('DETAILS_LOCATION')}</Title>
      <Map space={space} building={building} />
    </Container>
  )
}

export default Description
