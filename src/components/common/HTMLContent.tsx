import React from 'react'

const HTMLContent = (props: { className?: string; html: string }) => {
  const { className, html } = props
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}

export default HTMLContent
