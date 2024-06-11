import React from 'react'
import styled from 'styled-components'

import MenuItem from '@material-ui/core/MenuItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import Select from '@material-ui/core/Select'

export const Option = styled(MenuItem)`
  font-size: 16px;
`

export const Header = styled(ListSubheader)`
  font-size: 16px;
  color: black;
  line-height: 20px;
  margin-top: 15px;
`

const DSelect = styled(Select)`
  width: 100%;
  background-color: #ffffff;
  padding: 0;
  border: none;
  :before,
  :focus,
  :after {
    border-bottom: 1px solid transparent !important;
    transition: none;
    content: '';
    background-color: transparent !important;
  }
  .MuiSelect-select {
    border: 1px solid #ced4da;
    border-radius: 3px;
    height: 21px;
    padding: 8px 6px 4px 6px;
  }
  .MuiSelect-select:focus {
    background-color: transparent !important;
    outline: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
    border: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
  }
  .MuiSelect-root {
    font-size: 16px;
  }
`

const Container = styled.div`
  label {
    display: block;
    padding-left: 6px;
    padding-bottom: 2px;
    color: #404042;
    font-size: 16px;
    font-weight: 400;
  }
`

const Dropdown = (props: {
  className?: string
  children: React.ReactNode
  label?: string
  id?: string
  value: any
  error?: string
  class?: string
  onChange?: (e: React.ChangeEvent<{ value: unknown }>) => void
  autoFocus?: boolean
}) => {
  const { className, label, children, id, value, onChange } = props
  return (
    <Container className={className}>
      {label && label !== '' ? <label htmlFor={props.id}>{label}</label> : null}
      <DSelect
        id={id}
        value={value}
        onChange={onChange}
        MenuProps={
          props.class ? { PaperProps: { className: props.class } } : {}
        }>
        {children}
      </DSelect>
    </Container>
  )
}

export default Dropdown
