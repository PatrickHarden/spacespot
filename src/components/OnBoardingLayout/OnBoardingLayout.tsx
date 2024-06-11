import React from 'react'
import styled from 'styled-components'
import Header from '../MainLayout/Header'
import Toaster from '../MainLayout/Toaster'
import Footer from 'components/MainLayout/Footer'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`
type LayoutProps = {
  children: JSX.Element | null
  hasFooter?: boolean
}
const OnBoardingLayout = (props: LayoutProps) => (
  <Layout>
    <Header />
    <Toaster />
    {props.children}
    {props.hasFooter && <Footer />}
  </Layout>
)

export default OnBoardingLayout
