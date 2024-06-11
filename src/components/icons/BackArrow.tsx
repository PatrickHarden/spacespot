import React from 'react'

const BackArrow = (props: any) => (
  <svg width={15} height={13} viewBox="0 0 15 13" {...props}>
    <title>{'Icons/back'}</title>
    <g fill="none" fillRule="evenodd">
      <path
        d="M1.092 7.439l4.536 4.598c.17.173.447.173.618 0a.446.446 0 00.001-.626L1.711 6.813a.447.447 0 010-.626l4.536-4.598a.446.446 0 000-.626.434.434 0 00-.62 0L1.093 5.561a1.34 1.34 0 000 1.878z"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        stroke="#000"
        strokeWidth={0.921}
        strokeLinecap="round"
        d="M1.416 6.5h12.75"
      />
    </g>
  </svg>
)

export default BackArrow
