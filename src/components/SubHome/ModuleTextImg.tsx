import React from 'react'
import styled from 'styled-components'

import Header2 from 'components/common/Heading2'
import device from 'services/global/device'

const ModuleContainer = styled.div<{ isImageFirst?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 80px;
  flex-direction: ${props => (props.isImageFirst ? 'row' : 'row-reverse')};
  @media ${device.mobile} {
    padding-bottom: 20px;
  }
`

const H3 = styled(Header2)<{ isImageFirst?: boolean }>`
  color: #000000;
  margin-top: 0;
  padding-left: ${props => (props.isImageFirst ? '30px' : '0')};
  @media ${device.mobile} {
    width: 100%;
    margin: 15px 0;
    padding-left: 0;
  }
`
const ModuleImg = styled.img<{ fullWidth?: boolean }>`
  width: ${props => (props.fullWidth ? '100%' : '50%')};
  object-fit: cover;
  @media ${device.mobile} {
    padding-left: 0;
    width: 100%;
  }
`
const ModulleText = styled.div<{ fullWidth?: boolean }>`
  width: ${props => (props.fullWidth ? '100%' : '50%')};
  @media ${device.mobile} {
    width: 100%;
  }
`
export const ModuleTextImg = (props: {
  title: string
  img: string
  children: React.ReactNode
  isImageFirst?: boolean
  fullWidth?: boolean
}) => {
  const { title, img, children, isImageFirst, fullWidth } = props
  return (
    <ModuleContainer isImageFirst={isImageFirst}>
      <ModuleImg src={img} fullWidth={fullWidth} />
      <ModulleText fullWidth={fullWidth}>
        <H3 isImageFirst={isImageFirst}>{title}</H3>
        {children}
      </ModulleText>
    </ModuleContainer>
  )
}

export default ModuleTextImg
