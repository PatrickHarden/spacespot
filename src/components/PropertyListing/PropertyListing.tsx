import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { PropertyCard } from '@cbreenterprise/spacespot-ui'
import { toSpaceData } from 'services/space/selectors'
import { generateGallery, getSpaceURI } from 'services/space/helpers'
import { Space } from 'services/space/types'
import history from 'browserhistory'

import { formatFloor } from 'services/onboarding/utils'
import DetailFixed from './DetailFixed'
import DetailFlex from './DetailFlex'
import defaultImg from 'assets/img/building.svg'
import { getLangPrefix } from 'intl'
import { Link } from 'react-router-dom'

const Card = styled(PropertyCard) <{ selected: boolean }>`
  box-shadow: ${props => (props.selected ? '0px 0px 1px 1px #6cb9d5' : 'none')};
  border: ${props => (props.selected ? '1px solid #6cb9d5' : '1px solid #ddd')};
  :hover {
    box-shadow: 0px 0px 1px 1px #6cb9d5;
    border: 1px solid #6cb9d5;
  }
`

const CustomLink = styled(Link)`
  text-decoration: none;
  color: #000;
`

const PropertyListing = (props: {
  spaces: Array<Space>
  selected: Space
  setSelected: (s: Space) => void
}) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const prefix = getLangPrefix()
  return (
    <>
      {props.spaces.map((item: Space, index: number) => {
        const currentSpace = toSpaceData(item)

        const images = currentSpace.uploadedImages
          ? currentSpace.uploadedImages.map(generateGallery)
          : []
        if (images.length === 0) {
          images.push({ url: defaultImg, alt: 'no photo' })
        }
        const type = currentSpace.type
        const chip =
          type === 'FIXED'
            ? { text: t('PROPCARD_CHIP_FIXED').toUpperCase(), color: '#6CB9D5' }
            : { text: t('PROPCARD_CHIP_FLEX').toUpperCase(), color: '#EBBF59' }
        const country = item['Common.ActualAddress']['Common.Country']
        const floor =
          type === 'FIXED' && currentSpace.spaceFloor !== undefined
            ? formatFloor(currentSpace.spaceFloor, t('PROPCARD_FLOOR'), country)
            : ''
        const uri = getSpaceURI(item)

        return (
          <CustomLink
            to={prefix + '/' + uri}
            key={index}
            onClick={e => e.preventDefault()}>
            <Card
              id={`space-${item['Common.PrimaryKey']}`}
              images={images}
              title={currentSpace.spaceName}
              subTitle={floor}
              isFavorite={false}
              onClick={() => {
                history.push(`${prefix}/${uri}`)
              }}
              selected={props.selected === item}
              onMouseEnter={() => {
                props.setSelected(item)
              }}
              onMouseLeave={() => {
                props.setSelected((null as unknown) as Space)
              }}
              chip={chip}>
              {type === 'FIXED' ? (
                <DetailFixed space={item} />
              ) : (
                <DetailFlex space={item} />
              )}
            </Card>
          </CustomLink>
        )
      })}
    </>
  )
}

export default PropertyListing
