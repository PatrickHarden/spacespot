import React from 'react'
import styled from 'styled-components'

const CheckBox = styled(
  (props: {
    children: React.ReactNode
    className?: string
    checked?: boolean
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  }) => {
    return (
      <label className={props.className}>
        {props.children}
        <input
          type="checkbox"
          checked={props.checked}
          onChange={props.onChange}
        />
        <span></span>
      </label>
    )
  },
)`
  display: block;
  position: relative;
  cursor: pointer;
  padding-left: 25px;
  margin: 10px 0;
  input {
    position: absolute;
    opacity 0;
    cursor: pointer;
    width: 0;
    height: 0
  }
  span {
    position: absolute;
    top: 0;
    left: 0;
    height: 15px;
    width: 15px;
    border: 2px solid #B3DBE9;
    margin-top: 1px;
  }
  input:checked ~ span {
    background-color: transparent;
  }

  span:after {
    content: " ";
    position: absolute;
    display: none;
  }

  input:checked ~ span:after {
    display: block;
  }

  span:after {
    left: 5px;
    top: 2px;
    width: 5px;
    height: 8px;
    border: solid black;
    border-width: 0 1px 2px 0;
    transform: rotate(45deg);
  }
`

export default CheckBox
