import React from 'react'
import styled from 'styled-components'
import device from 'services/global/device'

import Header3 from 'components/common/Heading3'
import { RichText } from '@sitecore-jss/sitecore-jss-react'

const H3 = styled(Header3)`
  color: #000000;
  text-align: left;
  margin-right: auto;
`
const Img = styled.img`
  height: 292px;
  width: 100%;
  object-fit: cover;
  border: 1px solid black;
`
const Container = styled.div`
  width: 300px;
  margin: 30px 0px 80px 30px;
  @media ${device.lessThanIPad} {
    width: 100%;
    margin: 50px auto;
  }
  text-align: left;
  display: inline-flex;
  flex-direction: column;
`

const Text = styled(RichText)`
  padding: 0 30px 0 0;
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
`

export const Promo = ({ fields }: any) => {
  if (!fields) {
    return <p>No fields</p>
  }
  return (
    <Container>
      <Img src={fields.Image.value.src} />
      <H3>{fields.Title.value}</H3>
      <Text field={fields.Text} />
    </Container>
  )
}

export default Promo
