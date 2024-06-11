import React, { ReactNode } from 'react'
import styled from 'styled-components'

import CheckCircle from '@material-ui/icons/CheckCircle'

export interface ButtonProps {
  className?: string
  selected: boolean | undefined
  onClick: () => void
  children: ReactNode
  disabled?: boolean
  disableIcon?: boolean
  testId?: string
}

const IconSelected = styled(CheckCircle)`
  position: absolute;
  background-color: #ffffff;
  top: -11px;
  right: -11px;
  &.MuiSvgIcon-root {
    font-size: 1.5rem;
  }
`

const OutlineButton = styled((props: ButtonProps) => {
  const { onClick, children, selected, disableIcon } = props
  return (
    <button
      data-testid={props.testId}
      className={props.className}
      onClick={onClick}
      disabled={props.disabled}>
      {selected && !disableIcon ? (
        <IconSelected fontSize="default" htmlColor="#6CB9D5" />
      ) : null}
      {children}
    </button>
  )
})`
  box-sizing: border-box;
  outline: none;
  border: ${props =>
    props.selected ? '2px solid #6CB9D5;' : '1px solid #dddddd;'};
  border-radius: 2px;
  position: relative;
  background-color: ${props => (props.selected ? 'white;' : '#f4f4f4;')};
  min-width: 120px;
  color: #000000;
  opacity: ${props => (props.disabled ? '0.4' : 'unset')};
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
`
export default OutlineButton
