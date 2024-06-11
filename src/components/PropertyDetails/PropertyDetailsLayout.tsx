import React from 'react'
import styled from 'styled-components'

import ImageGallery from 'components/PropertyDetails/ImageGallery'
import DetailsNav from 'components/PropertyDetails/DetailsNav'
import Description from 'components/PropertyDetails/Description'
import SubmitEnquiryBox from 'components/PropertyDetails/SubmitEnquiryBox'

import device from 'services/global/device'
import { Space } from 'services/space'
import { AmenityOptions } from 'services/onboarding/types'
import Footer from 'components/MainLayout/Footer'

const Layout = styled.div`
  padding: 0;
  @media ${device.mobile} {
    margin-bottom: 49px;
  }
`

const Main = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`
const Col1 = styled.div`
  flex: 1 1 auto;
  margin-right: 30px;
  @media ${device.mobile} {
    margin-right: 0;
    width: 100%;
  }
`
const Col2 = styled.div`
  flex: 0 0 325px;
  @media ${device.mobile} {
    display: none;
  }
`
const PropertyDetailsLayout = (props: {
  space: Space
  parent: Space
  regionAmenities: AmenityOptions
  isEnquiry?: boolean
  isFixed?: boolean
}) => {
  const { space, parent, regionAmenities, isEnquiry, isFixed } = props
  return (
    <Layout>
      <ImageGallery space={space} building={parent} />
      <DetailsNav isEnquiry={isEnquiry} space={space} />
      <Main>
        <Col1>
          <Description
            space={space}
            building={parent}
            regionAmenities={regionAmenities}
          />
        </Col1>
        {isEnquiry ? (
          <Col2>
            <SubmitEnquiryBox isFixed={Boolean(isFixed)} />
          </Col2>
        ) : null}
      </Main>
      <Footer />
    </Layout>
  )
}
export default PropertyDetailsLayout
