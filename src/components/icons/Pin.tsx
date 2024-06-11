import * as React from 'react'

const Pin = (props: any) => (
  <svg width={26} height={30} viewBox="0 0 16 22" {...props}>
    <title>{'pin'}</title>
    <g fill="#000" fillRule="nonzero">
      <path d="M7.586 0C3.403 0 0 3.403 0 7.586a7.57 7.57 0 001.132 3.99l6.022 9.704a.632.632 0 00.538.299h.005a.632.632 0 00.537-.308l5.868-9.798a7.577 7.577 0 001.07-3.887C15.172 3.403 11.77 0 7.586 0zm5.431 10.824l-5.335 8.908-5.475-8.823a6.314 6.314 0 01-.951-3.323c0-3.486 2.844-6.33 6.33-6.33s6.326 2.844 6.326 6.33a6.316 6.316 0 01-.895 3.238z" />
      <path d="M7.586 3.793a3.797 3.797 0 00-3.793 3.793 3.788 3.788 0 003.793 3.793 3.786 3.786 0 003.793-3.793 3.797 3.797 0 00-3.793-3.793zm0 6.33A2.54 2.54 0 015.05 7.586 2.546 2.546 0 017.586 5.05a2.542 2.542 0 012.533 2.537 2.534 2.534 0 01-2.533 2.537z" />
    </g>
  </svg>
)

export default Pin