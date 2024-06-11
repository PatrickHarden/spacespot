import React from 'react'
import { get } from 'lodash'

const Pdf = (props: { size?: string }) => {
  const sz = get(props, 'size', '1em')
  return (
    <svg width={sz} height={sz} viewBox="0 0 25 30" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M4.524 0l13.378.234 6.794 6.794-.36 20.644a2.077 2.077 0 01-2.113 2.04L4.01 29.396a2.077 2.077 0 01-2.04-2.113L2.41 2.04A2.077 2.077 0 014.524 0z"
          fill="#E2E5E7"
        />
        <path
          d="M2.03 22.046h17.124c.618 0 1.118.501 1.118 1.119v.799c0 .617-.5 1.118-1.118 1.118H2.029v-3.036z"
          fill="#CAD1D8"
        />
        <path
          d="M17.847.157l.114.002 6.794 6.794-.003.159h-4.508a2.397 2.397 0 01-2.397-2.396V.156z"
          fill="#B0B7BD"
        />
        <rect
          fill="#F15642"
          y={13.259}
          width={20.27}
          height={11.025}
          rx={1.118}
        />
        <text
          fontFamily="Avenir-Heavy, Avenir"
          fontSize={6.081}
          fontWeight={600}
          fill="#FFF">
          <tspan x={3.355} y={21.194}>
            {'PDF'}
          </tspan>
        </text>
      </g>
    </svg>
  )
}

export default Pdf
