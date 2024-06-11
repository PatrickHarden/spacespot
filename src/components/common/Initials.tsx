import React from 'react'

const Initials = (props: {
  className?: string
  name: string
  palette: number
}) => {
  const { name, palette, className } = props
  const palettes = [
    { color: '#6cb9d5', bg: '#e1f1f6', opacity: '1' },
    { color: '#fe7062', bg: '#ffcdc8', opacity: '1' },
    { color: '#ffffff', bg: '#000000', opacity: '0' },
  ]
  const color = palettes[palette].color
  const bg = palettes[palette].bg
  const opacity = palettes[palette].opacity
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="54"
      height="54"
      viewBox="-2 -2 58 58">
      <g
        fill="white"
        fillRule="evenodd"
        stroke="none"
        strokeWidth="1"
        opacity="1">
        <g
          stroke={color}
          fill={bg}
          fillOpacity={opacity}
          fillRule="nonzero"
          strokeWidth="2">
          <circle cx="27" cy="27" r="27" />
        </g>
        <g fill={color} fillRule="nonzero">
          <text id="name" textAnchor="middle" fontSize="26" fontWeight="400">
            <tspan x="27" y="37">
              {name}
            </tspan>
          </text>
        </g>
      </g>
    </svg>
  )
}

export default Initials
