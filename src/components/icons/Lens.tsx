import * as React from 'react'

const Lens = (props: any) => (
  <svg width={50} height={50} viewBox="0 0 50 50" {...props}>
    <title>{'search'}</title>
    <path
      d="M49.695 48.222L34.48 33.008c3.16-3.508 5.102-8.134 5.102-13.216C39.583 8.879 30.705 0 19.792 0S0 8.879 0 19.792c0 10.913 8.879 19.791 19.792 19.791 5.082 0 9.708-1.942 13.216-5.102l15.214 15.214a1.038 1.038 0 001.473 0 1.041 1.041 0 000-1.473zM19.792 37.5c-9.764 0-17.709-7.944-17.709-17.708 0-9.765 7.945-17.709 17.709-17.709 9.763 0 17.708 7.944 17.708 17.709 0 9.764-7.945 17.708-17.708 17.708z"
      fill="#000"
      fillRule="nonzero"
      stroke="#828286"
      strokeWidth="3"
    />
  </svg>
)

export default Lens
