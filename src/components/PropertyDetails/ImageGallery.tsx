import React from 'react'
import styled from 'styled-components'
import ReactImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import device from 'services/global/device'

import { Space } from 'services/space'
import { getImages } from 'services/space/helpers'
import defaultImg from 'assets/img/building.svg'

const Container = styled.div<{ thumbSize: string }>`
  height: 450px;
  width: 100%;
  .image-gallery,
  .image-gallery-slide-wrapper,
  .image-gallery-content .image-gallery-slide .image-gallery-image {
    height: 450px;
  }
  .image-gallery-content .image-gallery-slide .image-gallery-image {
    display: block;
    width: 100%;
    object-fit: cover;
  }
  .image-gallery-bullets .image-gallery-bullet {
    box-shadow: unset;
    border: 1px solid black;
    background: #fff;
  }

  .image-gallery-bullets .image-gallery-bullet:focus,
  .image-gallery-bullets .image-gallery-bullet:hover,
  .image-gallery-bullets .image-gallery-bullet.active {
    background: #fff;
    transform: scale(1.5);
  }

  .image-gallery-slide-wrapper.right {
    width: calc(100% - ${props => props.thumbSize});
  }

  .image-gallery-thumbnails-wrapper.right {
    margin: 0;
    width: ${props => props.thumbSize};
  }

  .image-gallery-thumbnails-wrapper.right
    .image-gallery-thumbnails
    .image-gallery-thumbnail
    + .image-gallery-thumbnail {
    margin: 0;
  }

  .image-gallery-thumbnails-wrapper.right
    .image-gallery-thumbnails
    .image-gallery-thumbnail {
    width: ${props => props.thumbSize};
    padding: 0;
    margin: 0;
    border: none;
  }
`

const ImageGallery = (props: {
  className?: string
  space: Space
  building: Space
}) => {
  const { className, space, building } = props
  const isMobile = useMediaQuery(device.mobile)
  const images = [...getImages(space), ...getImages(building)]

  if (images.length === 0) {
    images.push({ original: defaultImg, thumbnail: defaultImg })
  }

  return (
    <Container className={className} thumbSize={isMobile ? '0px' : '330px'}>
      <ReactImageGallery
        items={images}
        showThumbnails={!isMobile}
        thumbnailPosition="right"
        showBullets={false}
        disableArrowKeys={false}
        showFullscreenButton={false}
        showPlayButton={false}
        showNav={false}
      />
    </Container>
  )
}

export default ImageGallery
