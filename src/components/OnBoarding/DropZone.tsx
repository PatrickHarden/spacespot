import React, { useCallback, useRef, ChangeEvent, ReactNode } from 'react'
import styled from 'styled-components'
import { get } from 'lodash'
import { useDropzone } from 'react-dropzone'
import Clear from '@material-ui/icons/Clear'

import {
  CommonPhotos1,
  CommonImage,
  CommonBrochures1,
} from 'services/space/PropertyListingschema'
import { getFileType } from 'services/global/util'
import pdf from 'assets/icons/pdf.svg'
import doc from 'assets/icons/doc.svg'
import CONFIG from 'config'

export interface DropItem {
  key: number | string
  uri: string
  name: string
  type: string
}

const ImgPreview = styled.img`
  width: 196px;
  height: 145px;
  display: block;
  object-fit: cover;
`

const ImgIcon = styled.img`
  width: 116px;
  height: 65px;
  display: block;
  padding: 40px;
`

export const ItemThumbnail = styled(
  (props: {
    className?: string
    item: DropItem
    canChange: boolean
    onRemove: () => void
    onChange: (item: DropItem) => void
  }) => {
    const inputEl = useRef<HTMLInputElement>(null)
    const handleName = (ev: ChangeEvent<HTMLInputElement>) => {
      const img: DropItem = { ...props.item }
      img.name = ev.target.value
      props.onChange(img)
    }
    const isImage = props.item.type.startsWith('image/')
    const icon = props.item.type === 'application/pdf' ? pdf : doc

    return (
      <div className={props.className}>
        {isImage ? (
          <ImgPreview src={props.item.uri} alt="img" />
        ) : (
          <ImgIcon src={icon} alt="doc" />
        )}
        <Clear onClick={props.onRemove} />
        {props.canChange ? (
          <>
            <input
              ref={inputEl}
              type="text"
              value={props.item.name}
              onChange={handleName}
            />
            <button
              onClick={() => {
                setTimeout(() => {
                  if (inputEl && inputEl.current !== null) {
                    inputEl.current.focus()
                  }
                }, 0)
              }}>
              &#9998;
            </button>
          </>
        ) : (
          <input
            ref={inputEl}
            type="text"
            value={props.item.name}
            disabled={true}
          />
        )}
      </div>
    )
  },
)`
  box-sizing: border-box;
  border: 1px solid #ffffff;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  position: relative;
  :hover {
    box-sizing: border-box;
    border: 1px solid #50bbd8;
    background-color: #ffffff;
    box-shadow: 0 1px 4px 0 #50bbd8;
  }
  .MuiSvgIcon-root {
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    background: #00000022;
  }
  input {
    background: transparent;
    border: none;
    height: 20px;
    width: 174px;
  }
  button {
    background: transparent;
    box-sizing: content-box;
    border: none;
    font-size: 14px;
    width: 20px;
    height: 20px;
    padding: 0;
    transform: rotate(90deg);
  }
`

const DropZoneBox = styled.div`
  display: inline-block;
  > div {
    border-radius: 4px;
    border: 1px solid #ced4da;
    box-sizing: border-box;
    width: 194px;
    min-height: 165px;
    :hover {
      cursor: pointer;
      border: 1px solid #50bbd8;
      background-color: #ffffff;
      box-shadow: 0 1px 4px 0 #50bbd8;
    }
    &.isDragging {
      cursor: pointer;
      border: 1px solid #50bbd8;
      background-color: #ffffff;
      box-shadow: 0 1px 4px 0 #50bbd8;
    }
  }
`

export const dropOnLoadEnd = (
  file: any,
  reader: FileReader,
  items: Array<DropItem>,
  setItems: (items: Array<DropItem>) => void,
) => () => {
  setItems([
    ...items,
    {
      key: items.length,
      uri: reader.result as string,
      name: file.name,
      type: file.type,
    },
  ])
}

const DropZone = styled(
  (props: {
    className?: string
    children: ReactNode
    accept: string
    isImage: boolean
    items: Array<DropItem>
    setItems: (items: Array<DropItem>) => void
    setUploaded: (items: CommonPhotos1 | CommonBrochures1) => void
    uploaded?: CommonPhotos1 | CommonBrochures1
  }) => {
    const {
      className,
      children,
      accept,
      isImage,
      items,
      setItems,
      setUploaded,
      uploaded,
    } = props
    const onDrop = useCallback(
      acceptedFiles => {
        const file = acceptedFiles[0]
        if (!file) {
          return
        }
        const reader = new FileReader()
        reader.onloadend = dropOnLoadEnd(file, reader, items, setItems)
        // reader.onabort = () => console.log('file reading was aborted')
        // reader.onerror = () => console.log('file reading has failed')
        reader.readAsDataURL(file)
      },
      [items, setItems],
    )
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept,
      maxSize: 10000000,
    })
    const remove = (name: string) => () => {
      const imgs = items.filter(img => img.name !== name)
      setItems(imgs)
    }
    const removeUploadedImage = (name: string) => () => {
      const imgs = uploaded
        ? (uploaded as CommonPhotos1).filter(
            img => get(img, 'Common.ImageCaption') !== name,
          )
        : []
      setUploaded(imgs)
    }
    const removeUploadedDoc = (name: string) => () => {
      const docs = uploaded
        ? (uploaded as CommonBrochures1).filter(
            doc => get(doc, 'Common.Uri') !== name,
          )
        : []
      setUploaded(docs)
    }

    const onChange = (image: DropItem) => {
      const imgs = [...items]
      imgs[image.key as number] = image
      setItems(imgs)
    }
    const getUri = (image: CommonImage) =>
      get(
        image,
        "['Common.ImageResources'][0]['Source.Uri']",
        CONFIG.GL_PHOTO_HOST +
          get(image, "['Common.ImageResources'][0]['Common.Resource.Uri']"),
      )

    return (
      <div className={className}>
        {uploaded &&
          isImage &&
          (uploaded as CommonPhotos1).map(item => (
            <ItemThumbnail
              key={get(item, 'Common.ImageCaption')}
              item={{
                key: get(item, 'Common.Order') as number,
                uri: getUri(item),
                name: get(item, 'Common.ImageCaption') as string,
                type: getFileType(getUri(item)),
              }}
              canChange={false}
              onRemove={removeUploadedImage(
                get(item, 'Common.ImageCaption') as string,
              )}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
            />
          ))}
        {uploaded &&
          !isImage &&
          (uploaded as CommonBrochures1).map(item => (
            <ItemThumbnail
              key={get(item, 'Common.Uri')}
              item={{
                key: get(item, 'Common.Uri') as string,
                uri: get(item, 'Common.Uri'),
                name: get(item, 'Common.Uri') as string,
                type: getFileType(get(item, 'Common.Uri')),
              }}
              canChange={false}
              onRemove={removeUploadedDoc(get(item, 'Common.Uri') as string)}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
            />
          ))}
        {items &&
          items.map(item => (
            <ItemThumbnail
              key={item.key}
              item={item}
              canChange={true}
              onRemove={remove(item.name)}
              onChange={onChange}
            />
          ))}
        <DropZoneBox>
          <div {...getRootProps()} className={isDragActive ? 'isDragging' : ''}>
            <input {...getInputProps()} />
            {children}
          </div>
        </DropZoneBox>
      </div>
    )
  },
)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export default DropZone
