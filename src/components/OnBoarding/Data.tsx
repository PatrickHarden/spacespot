import React from 'react'
import styled from 'styled-components'

const DataContainer = styled.div`
  margin-top: 5px;
  flex-grow: 1;
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
  line-height: 10px;
  margin-top: 2px;
`

const Data = (props: { label: string; value: string | number }) => (
  <DataContainer>
    <Title>{props.value}</Title>
    <SubTitle>{props.label}</SubTitle>
  </DataContainer>
)

export default Data
