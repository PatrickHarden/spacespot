import React from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  margin: 10px 0 0 0;
  label {
    display: block;
    padding-left: 6px;
    padding-bottom: 2px;
    color: #404042;
    font-size: 16px;
    font-weight: 400;
  }
`

const BInput = styled.textarea<{ error?: string }>`
  margin-top: 0;
  resize: none;
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
`

const TextArea = (props: {
  className?: string
  label?: string
  id: string
  value: any
  min?: any
  error?: string
  rows?: number
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => {
  const { className, label, ...rest } = props
  return (
    <InputContainer className={className}>
      <label htmlFor={props.id}>{label}</label>
      <BInput {...rest} />
      <ErrorMessage>{props.error}</ErrorMessage>
    </InputContainer>
  )
}

export default TextArea
