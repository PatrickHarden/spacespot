import React from 'react'
import { get } from 'lodash'

const Plus = (props: { size?: string; color?: string }) => {
  const sz = get(props, 'size', '1em')
  const color = get(props, 'color', '#6CB9D5')
  return (
    <svg width={sz} height={sz} viewBox="0 0 18 17" {...props}>
      <g
        stroke={color}
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round">
        <path d="M9 1.6v13.8M1.64 8.5h14.72" />
      </g>
    </svg>
  )
}

export default Plus
