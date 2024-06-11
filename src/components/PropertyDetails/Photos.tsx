import React from 'react'
import styled from 'styled-components'
import { getFileType } from 'services/global/util'
import pdf from 'assets/icons/pdf.svg'

const Box = styled.a`
  display: flex;
  color: unset;
  text-decoration: none;
  justify-content: center;
  height: 100%;
  min-height: 100px;
  margin: auto;
`
const Container = styled.div`
  margin-top: 15px;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  div {
    border: 1px solid #ddd;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
      outline: none;
    }
    :hover {
      border: 1px solid #6cb9d5;
      box-shadow: 0 1px 4px 0 #6cb9d5;
    }
  }
  div a img {
    width: 50px;
    height: unset;
    object-fit: none;
  }
`
const Photos = (props: {
  className?: string
  images: Array<{
    original: string | undefined
    thumbnail: string | undefined
  }>
}) => {
  const { className, images } = props

  const isInFullScreen = () => {
    const doc: any = document
    return doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement
      ? true
      : false
  }

  const closeFullScreen = () => {
    if (isInFullScreen()) {
      const doc: any = document
      if (doc.exitFullscreen) {
        doc.exitFullscreen()
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen()
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen()
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen()
      }
    }
  }

  const onClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (isInFullScreen()) {
      closeFullScreen()
      return
    }
    const target = event.target as any
    if (target.requestFullscreen) {
      target.requestFullscreen()
    } else if (target.mozRequestFullScreen) {
      target.mozRequestFullScreen()
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen()
    } else if (target.msRequestFullscreen) {
      target.msRequestFullscreen()
    }
  }

  return (
    <Container data-auto="detail-photos" className={className}>
      {images.map(img => {
        if (img.thumbnail) {
          const type = getFileType(img.thumbnail)
          if (!type.startsWith('image/')) {
            return (
              <div key={img.thumbnail}>
                <Box
                  href={img.thumbnail}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img src={pdf} alt="space" data-auto="detail-photo-pdf" />
                </Box>
              </div>
            )
          }
        }
        return (
          <div key={img.thumbnail}>
            <img
              tabIndex={0}
              onClick={onClick}
              onKeyPress={closeFullScreen}
              src={img.thumbnail}
              data-auto="detail-photo-img"
              alt="space"
            />
          </div>
        )
      })}
    </Container>
  )
}

export default Photos
