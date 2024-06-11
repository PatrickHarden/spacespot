import React from 'react'
import styled from 'styled-components'
import device from 'services/global/device'

import { RichText } from '@sitecore-jss/sitecore-jss-react'

const ModuleContainer = styled.div`
  width: 300px;
  margin: 30px 0px 80px 30px;
  @media ${device.lessThanIPad} {
    width: 100%;
    margin: 50px auto;
  }
  text-align: left;
  display: inline-flex;
  flex-direction: column;
  padding-bottom: 20px;
  background-color: #fafafa;
  box-shadow: 0 1px 5px 2px rgba(64, 64, 66, 0.2);
  position: relative;
`

const Text = styled(RichText)`
  padding: 0 30px;
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
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
  left: calc(100% / 2 - 20px);
  color: #ffffff;
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  font-weight: 500;
`

export const Panel = ({ fields }: any) => {
  if (!fields) {
    return <p>No fields</p>
  }
  return (
    <ModuleContainer>
      <Circle>{fields.Heading.value}</Circle>
      <H4>{fields.Title.value}</H4>
      <Text field={fields.Text} />
    </ModuleContainer>
  )
}

export default Panel
