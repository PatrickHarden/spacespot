import React from 'react'
import styled from 'styled-components'
import PopoverButton, { PopoverButtonProps } from './PopoverButton'

const InputContainer = styled.div`
  margin: 10px 0 0 0;
  label {
    display: block;
    padding-bottom: 2px;
    color: #404042;
    font-size: 16px;
    font-weight: 400;
    white-space: nowrap;
  }
`

const BInput = styled.input<{ error?: string }>`
  margin-top: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: ${props => (props.error ? '#db4437' : '#010102')};
  letter-spacing: -0.2px;
  width: 100%;
  box-sizing: border-box;
  padding: 6px 6px;
  outline: none;
  border: 1px solid ${props => (props.error ? '#db4437' : '#dddddd')};
  border-radius: 3px;
  :focus {
    outline: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
    border: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
  }
`
const ErrorMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #db4437;
  display: inline-block;
`

const PopoverContainer = styled.div`
  display: inline-block;
`
interface InputProps {
  className?: string
  label?: string
  id: string
  type: string
  value: any
  min?: any
  max?: any
  error?: string
  popover?: PopoverButtonProps
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (e: React.KeyboardEvent) => void
  onBlur?: () => void
  onFocusOut?: () => void
  autoFocus?: boolean
  placeholder?: string
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  const { className, label, popover, ...rest } = props

  // Avoid 'e' key if type is number
  const avoidKeys = (e: React.KeyboardEvent<HTMLInputElement>): boolean => {
    const ok = e.keyCode !== 69
    if (!ok) {
      e.preventDefault()
    }
    return ok
  }

  return (
    <InputContainer className={className}>
      {label && label !== '' ? <label htmlFor={props.id}>{label}</label> : null}
      <BInput
        onKeyDown={props.type === 'number' ? avoidKeys : undefined}
        {...rest}
      />
      <ErrorMessage>{props.error}</ErrorMessage>
      {popover && (
        <PopoverContainer>
          <PopoverButton {...popover} />
        </PopoverContainer>
      )}
    </InputContainer>
  )
}

export default Input
