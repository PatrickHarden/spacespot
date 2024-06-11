import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Redirect, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

import actions from 'services/space/actions'
import selectors from 'services/space/selectors'
import user from 'services/user/selectors'
import {
  getStreet,
  getSpaceURI,
  getPK,
  getCity,
  getDistrict,
  getSubdistrict,
} from 'services/space/helpers'
import Header from 'components/MainLayout/Header'
import SubmitEnquiryBox from 'components/PropertyDetails/SubmitEnquiryBox'
import PropertyDetailsLayout from 'components/PropertyDetails/PropertyDetailsLayout'
import device from 'services/global/device'
import Toaster from 'components/MainLayout/Toaster'
import Analytics, { usePixel } from 'services/analytics'
import { postViewEvent } from 'services/event/api'
import CONFIG from 'config'
import { getLangPrefix } from 'intl'
import Spinner from 'components/icons/Spinner'

const SubmitEnquiryNav = styled(SubmitEnquiryBox)`
  @media ${device.desktop} {
    display: none;
  }
  @media ${device.tablet} {
    display: none;
  }
`

const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`

const PropertyDetails = () => {
  const [redirect, setRedirect] = useState(true)
  const { spaceId } = useParams()
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const location = useLocation()
  const space = useSelector(selectors.selectedSpace)
  const parent = useSelector(selectors.parentSpace)
  const regionAmenities = useSelector(selectors.regionAmenities)
  const token = useSelector(user.token)

  usePixel(Analytics.PIXELS.SELECT_SPACE)
  useEffect(() => {
    if (spaceId) {
      // load the new selected space
      dispatch(actions.getSelectedSpace(spaceId))
    }
  }, [dispatch, spaceId])

  // previous loaded id maybe different than the requested id
  const selectedId = getPK(space)
  const isFixed = selectors.isFixed(space)
  const address = getStreet(space)
  const uri = getSpaceURI(space)
  const prefix = getLangPrefix()
  const url = `${prefix}/${uri}`
  const city = getCity(space)
  const district = getDistrict(space)
  const subdistrict = getSubdistrict(space).name

  // avoid infinite redirect loop in case of problematic URI
  useEffect(() => {
    if (
      space &&
      spaceId === selectedId &&
      redirect &&
      location.pathname !== url
    ) {
      setRedirect(false)
    }
  }, [space, redirect, url, location, spaceId, selectedId])

  useEffect(() => {
    const enabled = navigator.userAgent !== 'ReactSnap'
    if (enabled && spaceId === selectedId) {
      postViewEvent(
        token,
        spaceId,
        isFixed ? 'Fixed' : 'Flex',
        city,
        district,
        subdistrict,
      )
    }
  }, [space, isFixed, subdistrict, spaceId, selectedId, token, city, district])

  if (!space || selectedId !== spaceId) {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    )
  }

  if (redirect && location.pathname !== url) {
    return <Redirect to={url} />
  }

  return (
    <>
      <Helmet>
        <title>
          {formatMessage(
            { id: 'SEO_TITLE_PROPERTY_DETAILS' },
            { ADDRESS: address },
          )}
        </title>
        <meta
          name="description"
          content={formatMessage(
            { id: 'SEO_DESCRIPTION_PROPERTY_DETAILS' },
            { ADDRESS: address },
          )}
        />
        <link
          rel="canonical"
          href={encodeURI(`${CONFIG.CANONICAL_HOST}${prefix}/${uri}`)}
        />
      </Helmet>
      <Header />
      <PropertyDetailsLayout
        space={space}
        parent={parent}
        regionAmenities={regionAmenities}
        isFixed={isFixed}
        isEnquiry={true}
      />
      <SubmitEnquiryNav isFixed={isFixed} />
      <Toaster />
    </>
  )
}

export default PropertyDetails
