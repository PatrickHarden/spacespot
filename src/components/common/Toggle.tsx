import React from 'react'
import styled from 'styled-components'

const RoundedButton = styled.button<{ selected: boolean; left?: boolean }>`
  position: relative;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
  color: ${props => (props.selected ? '#000000' : '#828286')};
  border: 2px solid ${props => (props.selected ? '#000000' : '#dddddd')};
  border-radius: 30px;
  z-index: ${props => (props.selected ? '1' : '0')};
  outline: none;
  padding-left: ${props => (!props.selected && !props.left ? '30' : '13')}px;
  padding-right: ${props => (!props.selected && props.left ? '30' : '13')}px;
  transition: color, border 0.5s ease;
  background-color: white;
  cursor: pointer;
`

const Container = styled.div`
  margin: 12px 10px 5px 0;
  button:last-child {
    margin-left: -20px;
  }
  overflow: hidden;
  white-space: nowrap;
`

const Toggle = (props: {
  displayName1: string
  displayName2: string
  value1: any
  value2: any
  value: any
  onChange: (val: any) => void
}) => {
  const { displayName1, displayName2, value1, value2, value, onChange } = props
  return (
    <Container>
      <RoundedButton
        left={true}
        onClick={() => onChange(value1)}
        selected={value === value1}>
        {displayName1}
      </RoundedButton>
      <RoundedButton
        onClick={() => onChange(value2)}
        selected={value === value2}>
        {displayName2}
      </RoundedButton>
    </Container>
  )
}

export default Toggle
