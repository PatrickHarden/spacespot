import { Button, Popover } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

export interface PopoverButtonProps {
  buttonText: string
  popoverText?: string
  displayFunction?: Function
}

const ButtonLink = styled(Button)`
  background: none !important;
  border: none;
  padding: 0 !important;
  color: #00a384;
  text-decoration: underline;
  cursor: pointer;
  text-transform: none;
  font-size: 14px;
`

const PopoverButton: React.FC<PopoverButtonProps> = (
  props: PopoverButtonProps,
) => {
  const { buttonText, popoverText, displayFunction } = props

  const [anchorEl, setAnchorEl] = React.useState<any>(null)

  const togglePopover = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault()
    if (anchorEl !== null) {
      setAnchorEl(null)
    } else {
      setAnchorEl(e.currentTarget)
    }
  }

  const id = anchorEl ? 'popover' : undefined

  return (
    <div>
      <ButtonLink onClick={togglePopover}>{buttonText}</ButtonLink>
      {id && (
        <Popover
          id={id}
          open={anchorEl ? true : false}
          anchorEl={anchorEl}
          onClose={togglePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}>
          {displayFunction ? displayFunction() : popoverText ? popoverText : ''}
        </Popover>
      )}
    </div>
  )
}

export default PopoverButton
