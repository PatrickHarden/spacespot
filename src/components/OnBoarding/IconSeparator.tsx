import React from 'react'
import styled from 'styled-components'
import Heading2 from 'components/common/Heading2'

const Container = styled.div`
  padding-top: 10px;
  padding-bottom: 18px;
`
const Line = styled.div`
  box-sizing: border-box;
  height: 1px;
  width: 100%;
  border: 1px solid #404042;
  border-top: 0;
  margin-top: 10px;
`
const IconText = styled.div`
  display: flex;
  align-items: center;
`

const TextSpace = styled(Heading2)`
  margin: 0;
  padding: 25px 0 0 15px;
`
const IconSeparator = (props: { label: string; icon: React.ReactNode }) => {
  return (
    <Container>
      <IconText>
        {props.icon}
        <TextSpace>{props.label}</TextSpace>
      </IconText>
      <Line />
    </Container>
  )
}
export default IconSeparator
