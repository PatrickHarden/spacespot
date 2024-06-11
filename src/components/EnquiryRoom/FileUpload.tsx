import React, { useCallback, ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'

export const onDropCB = (
  addFile: (file: File, reader: FileReader) => () => void,
) => (acceptedFiles: Array<File>) => {
  const file = acceptedFiles[0]
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onloadend = addFile(file, reader)
  reader.readAsDataURL(file)
}

const FileUpload = (props: {
  className?: string
  children: ReactNode
  accept: string
  addFile: (file: File, reader: FileReader) => () => void
}) => {
  const { children, className, accept, addFile } = props
  const onDrop = useCallback(onDropCB(addFile), [addFile])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: 10000000,
  })
  return (
    <div className={className}>
      <div {...getRootProps()} className={isDragActive ? 'isDragging' : ''}>
        <input {...getInputProps()} />
        {children}
      </div>
    </div>
  )
}

export default FileUpload
