import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'

import device from 'services/global/device'
import Header from './Header'
import ChatShare from 'components/EnquiryRoom/ChatShare'
import Negotiation from 'components/EnquiryRoom/Negotiation'
import SpaceDetails from 'components/EnquiryRoom/SpaceDetails'
import Toaster from 'components/MainLayout/Toaster'

const Layout = styled.div<{ addMargin: boolean }>`
  @media ${device.mobile} {
    margin-top: ${props => (props.addMargin ? '90' : '0')}px;
    transition: margin 0.2s ease-in-out;
  }
`

const Empty = styled.div`
  min-height: 900px;
`

const EnquiryRoomLayout = () => {
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.documentElement.scrollTop)
      setIsScrollingDown(e.target.documentElement.scrollTop > scrollTop)
    }
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollTop])
  return (
    <>
      <Header hide={isScrollingDown} />
      <Layout addMargin={!isScrollingDown}>
        <Switch>
          <Route path="/enquiry/:enquiryId/space" component={SpaceDetails} />
          <Route
            path="/enquiry/:enquiryId/chat"
            render={() => <ChatShare scrollTop={scrollTop} />}
          />
          <Route path="/enquiry/:enquiryId/negotiate" component={Negotiation} />
          <Route component={Empty} />
        </Switch>
      </Layout>
      <Toaster />
    </>
  )
}
export default EnquiryRoomLayout
