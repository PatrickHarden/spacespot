import React from 'react'
import styled from 'styled-components'
import device from 'services/global/device'

const ModuleContainer = styled.div`
  width: 30%;
  margin: 0 auto;
  padding-bottom: 20px;
  background-color: #fafafa;
  box-shadow: 0 1px 5px 2px rgba(64, 64, 66, 0.2);
  position: relative;
  top: -20px;
  @media ${device.mobile} {
    width: 100%;
    margin-top: 50px;
  }
`

const H4 = styled.h4`
  text-align: center;
  color: #000000;
  font-size: 18px;
  font-weight: 500;
`
const Circle = styled.div`
  height: 40px;
  width: 40px;
  background-color: #f35c2b;
  box-shadow: 0 1px 5px 2px rgba(64, 64, 66, 0.2);
  border-radius: 30px;
  position: absolute;
  top: -20px;
  left: 45%;

  color: #ffffff;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  font-weight: 500;
`
export const ModuleCountingText = (props: {
  title: string
  number: number
  children: React.ReactNode
}) => {
  const { children, title, number } = props
  return (
    <ModuleContainer>
      <Circle>{number}</Circle>
      <H4>{title}</H4>
      {children}
    </ModuleContainer>
  )
}

export default ModuleCountingText
