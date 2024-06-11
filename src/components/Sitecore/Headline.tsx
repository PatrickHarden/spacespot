import React from 'react'
import styled from 'styled-components'

import Header2 from 'components/common/Heading2'

const H2 = styled(Header2)`
  color: #000000;
  width: 100%;
  text-align: center;
  margin-right: auto;
`

export const Headline = ({ fields }: any) => {
  if (!fields) {
    return <p>No fields</p>
  }
  return <H2>{fields.Heading.value}</H2>
}

export default Headline
