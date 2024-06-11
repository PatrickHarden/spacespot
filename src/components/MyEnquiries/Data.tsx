import React from 'react'
import styled from 'styled-components'
import device from 'services/global/device'

const DataContainer = styled.div<{ isThird?: boolean }>`
  min-width: 70px;
  margin-top: 5px;
  margin-right: 20px;
  ${props => (props.isThird ? `width:33%;` : 'flex-grow: 1;')}
  @media ${device.lessThanIPad} {
    flex-grow: 0;
    margin-right: 10px;
    width: 33.33%;
  }
`

const Title = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  width: 100%;
`
const SubTitle = styled.div`
  color: #828286;
  font-size: 14px;
  font-weight: 400;
  word-break: break-all;
  line-height: 15px;
`

const Data = (props: {
  label: string
  value: string | number
  isThird?: boolean
}) => (
  <DataContainer isThird={props.isThird}>
    <Title>{props.value}</Title>
    <SubTitle>{props.label}</SubTitle>
  </DataContainer>
)

export default Data
