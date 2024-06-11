import React from 'react'
import styled from 'styled-components'

import Header from '../MainLayout/Header'

const Container = styled.div`
  max-width: 1260px;
  margin: 0 auto;
`

const Layout = (props: { children: React.ReactNode }) => (
  <>
    <Header />
    <Container>{props.children}</Container>
  </>
)

export default Layout
