import React from 'react'
import styled from 'styled-components'

import Header3 from 'components/common/Heading3'

import device from 'services/global/device'

const ModuleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 31%;
  margin: 0 auto;
  padding-bottom: 20px;
  @media ${device.mobile} {
    width: 100%;
  }
`

const Img = styled.img`
  width: 100%;
  height: 292px;
  object-fit: cover;
`
const H3 = styled(Header3)`
  color: #000000;
  text-align: left;
  margin-right: auto;
`

export const ModuleImgTextHorizontal = (props: {
  img: string
  title: string
  children: React.ReactNode
}) => {
  const { img, children, title } = props
  return (
    <ModuleContainer>
      <Img src={img} />
      <H3>{title}</H3>
      {children}
    </ModuleContainer>
  )
}

export default ModuleImgTextHorizontal
