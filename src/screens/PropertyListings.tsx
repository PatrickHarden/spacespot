/*global google */
import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api'
import {
  Cluster,
  Clusterer,
  ClusterIconInfo,
  ClusterIconStyle,
  MarkerExtended,
} from '@react-google-maps/marker-clusterer'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Header from '../components/MainLayout/Header'
import { Space } from 'services/space/types'
import selectors from 'services/search/selectors'
import actions from 'services/search/actions'
import userSelectors from 'services/user/selectors'

import device from 'services/global/device'
import Filters from 'components/PropertyListing/Filters'

import PropertyListing from 'components/PropertyListing/PropertyListing'
import spotDark from 'assets/icons/spot-dark.svg'
import spotOrange from 'assets/icons/spot-orange.svg'
import { spotPath } from 'components/icons/paths'

import { getZoomByBounds } from 'services/global/util'
import { noPrerender, withGoogle } from 'components/common/hocs'
import Analytics from 'services/analytics'
import CONFIG from 'config'

const Container = styled.div`
  display: flex;
  padding-left: 20px;
  padding-top: 0;
  @media ${device.mobile} {
    padding-right: 0;
    padding-left: 0;
  }
`

const StickyFilters = styled(Filters)`
  z-index: 5;
  position: sticky;
  top: 0px;
  background: white;
  padding: 0 20px;
`

const ColSearch = styled.div`
  flex: 0 0 620px;
  padding-top: 20px;
  margin-bottom: 80px;
  @media ${device.tablet} {
    flex: 0 0 320px;
  }
  @media ${device.mobile} {
    flex: 1 1 auto;
    padding: 20px 20px 0 20px;
  }
`

const ColMap = styled.div`
  flex: 1 1 auto;
  padding-left: 20px;
  @media ${device.mobile} {
    padding-left: 0;
  }
`

const GMap = noPrerender(
  withGoogle(styled.div`
    position: sticky;
    top: 65px;
  `),
)

const SortBar = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-direction: column;
  @media ${device.desktop} {
    flex-direction: row;
  }
`

const Found = styled.h1`
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 500;
`

const SortByContainer = styled.div`
  display: flex;
  align-content: center;
`
const SortBy = styled.div`
  margin-right: 5px;
  font-size: 16px;
  color: #828286;
`
const Match = styled.div`
  font-size: 16px;
  margin-right: 5px;
`

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-gap: 20px;
`

const getDataBounds = (spaces: Array<Space>) => {
  const bounds = new google.maps.LatLngBounds()
  if (spaces.length < 1) {
    return bounds
  }
  spaces.forEach(item => {
    const lat = item['Common.Coordinate'].lat
    const lng = item['Common.Coordinate'].lon
    if (lat <= 90 && lng <= 180) {
      bounds.extend(new google.maps.LatLng(lat, lng))
    }
  })
  return bounds
}

const PropertyListings = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const [toggle, setToggle] = useState(false)
  const [map, setMap] = useState((null as unknown) as google.maps.Map)
  const [clusterer, setClusterer] = useState((null as unknown) as Clusterer)
  const [bounds, setBounds] = useState(
    (null as unknown) as google.maps.LatLngBounds,
  )
  const [selected, setSelected] = useState((null as unknown) as Space)
  const isMobile = useMediaQuery(device.mobile)
  const GAUser = useSelector(userSelectors.getGAUser)

  const spaces: Array<Space> =
    useSelector(selectors.selectSearchedWithFilters) || []
  const numSpaces: number = useSelector(selectors.selectNumSpaces) || 0
  const showMap = spaces.length > 0 && (!isMobile || toggle)
  const showList = !isMobile || !toggle

  const contained = bounds
    ? spaces.filter(item => {
      const lat = item['Common.Coordinate'].lat
      const lng = item['Common.Coordinate'].lon
      return bounds.contains(new google.maps.LatLng(lat, lng))
    })
    : spaces

  useEffect(() => {
    // redraw icons if selected space changes
    if (clusterer) {
      try {
        clusterer.repaint()
      } catch (err) {
        // ignore
      }
    }
  }, [clusterer, selected])

  useEffect(() => {
    // recalc bounds if spaces change
    if (spaces.length > 0 && map) {
      const bounds = getDataBounds(spaces)
      map.setCenter(bounds.getCenter())
      map.fitBounds(bounds)
    }
  }, [spaces, map])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(actions.putURLParams())
  }, [dispatch])

  const onBoundsChanged = () => {
    const newBounds = map.getBounds()
    if (newBounds) {
      setBounds(newBounds)
    }
    Analytics.event({
      category: 'List',
      action: 'Drag-Map',
      ...GAUser,
    })
  }

  const onLoadMap = (map: google.maps.Map) => {
    if (bounds) {
      map.setCenter(bounds.getCenter())
      map.fitBounds(bounds)
    }
    setMap(map)
  }

  const toggleMap = useCallback(() => {
    setToggle(!toggle)
  }, [toggle])

  const getIcon = (space: Space): google.maps.Symbol => {
    const color = space === selected ? '#F35C2B' : '#000'
    return {
      anchor: new google.maps.Point(5, 15),
      labelOrigin: new google.maps.Point(0, 0),
      fillColor: color,
      strokeColor: color,
      strokeWeight: 1,
      fillOpacity: 1,
      path: spotPath,
      scale: 2,
    }
  }

  const clusterStyles: Array<ClusterIconStyle> = [
    {
      textColor: 'white',
      url: spotDark,
      height: 40,
      width: 40,
      anchorIcon: [40, 20],
      anchorText: [-5, 0],
      fontFamily: 'futura-pt, sans-serif',
      fontWeight: '400',
      textSize: 13,
    },
    {
      textColor: 'black',
      url: spotOrange,
      height: 40,
      width: 40,
      anchorIcon: [40, 20],
      anchorText: [-5, 0],
      fontFamily: 'futura-pt, sans-serif',
      fontWeight: '400',
      textSize: 13,
    },
  ]

  const isMarkerSelected = (markers: Array<MarkerExtended>) => {
    if (!selected) return false
    let found = false
    markers.forEach(item => {
      const pos = item.getPosition()
      if (
        pos &&
        pos.lat() === selected['Common.Coordinate'].lat &&
        pos.lng() === selected['Common.Coordinate'].lon
      ) {
        found = true
      }
    })
    return found
  }

  const calculator = (markers: Array<MarkerExtended>): ClusterIconInfo => {
    const index = isMarkerSelected(markers) ? 2 : 1
    return {
      index: index,
      text: markers.length.toString(),
      title: '',
    }
  }

  const choose = (space: Space) => {
    setSelected(space)
  }

  const isSmoothScrollSupported =
    'scrollBehavior' in document.documentElement.style

  const onClickSpace = (space: Space) => () => {
    setSelected(space)
    if (isMobile) {
      setToggle(false)
    }
    const id = `space-${space['Common.PrimaryKey']}`
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - 70
      if (isSmoothScrollSupported) {
        window.scroll({
          left: 0,
          top: top,
          behavior: 'smooth',
        })
      } else {
        window.scroll(0, top)
      }
      Analytics.event({
        category: 'List',
        action: 'Click-Map-Space',
        ...GAUser,
      })
    }
  }

  const onClusterClick = (cluster: Cluster) => {
    const maxZoom = 19
    const padding = 30
    const bounds = cluster.getBounds()
    const zoom = getZoomByBounds(map, bounds, padding)

    if (zoom > maxZoom) {
      map.setCenter(bounds.getCenter())
      map.setZoom(maxZoom)
      if (isMobile) {
        setToggle(false)
        setBounds(bounds)
      }
    } else {
      map.fitBounds(bounds, padding)
    }
    Analytics.event({
      category: 'List',
      action: 'Click-Map-Cluster',
      ...GAUser,
    })
  }

  const onLoadCluster = (clusterer: Clusterer) => {
    setClusterer(clusterer)
  }
  const location = useSelector(selectors.searchFiltersWhere)
  const nSpaces = numSpaces !== -1 ? numSpaces : spaces.length
  return (
    <>
      <Helmet>
        <title>
          {location
            ? formatMessage(
              { id: 'SEO_TITLE_LISTING_WITH_LOCATION' },
              { LOCATION: location },
            )
            : t('SEO_TITLE_LISTING_WITHOUT_LOCATION')}
        </title>
        <meta
          name="description"
          content={
            location
              ? formatMessage(
                { id: 'SEO_DESCRIPTION_LISTING_WITH_LOCATION' },
                { LOCATION: location },
              )
              : t('SEO_DESCRIPTION_LISTING_WITHOUT_LOCATION')
          }
        />
        <link
          rel="canonical"
          href={`${CONFIG.CANONICAL_HOST}/${window.location.pathname}${window.location.search}`}
        />
      </Helmet>
      <Header />
      <StickyFilters
        key="nav-filters"
        showMap={showMap}
        onToggleClick={toggleMap}
      />
      <Container>
        {showList && (
          <ColSearch>
            <SortBar>
              <Found>
                {location
                  ? formatMessage(
                    { id: 'LIST_SPACES_NEAR_LOCATION' },
                    {
                      NUM: nSpaces,
                      LOCATION: location,
                    },
                  )
                  : formatMessage(
                    { id: 'LIST_SPACES' },
                    {
                      NUM: nSpaces,
                    },
                  )}
              </Found>
              <SortByContainer>
                <SortBy>{t('PROPCARD_SORT_BY')}</SortBy>
                <Match>{t('PROPCARD_MATCH')}</Match>
                <ArrowDownward />
              </SortByContainer>
            </SortBar>
            <Items data-auto="List-card-container">
              {contained.length > 0 && (
                <PropertyListing
                  spaces={contained}
                  selected={selected}
                  setSelected={choose}
                />
              )}
            </Items>
          </ColSearch>
        )}
        {showMap && (
          <ColMap>
            <GMap>
              <GoogleMap
                test-id="map"
                onLoad={onLoadMap}
                onBoundsChanged={onBoundsChanged}
                mapContainerStyle={{
                  height: `calc(100vh - 65px)`,
                  width: '100%',
                }}
                zoom={14}>
                <MarkerClusterer
                  onLoad={onLoadCluster}
                  calculator={calculator}
                  styles={clusterStyles}
                  zoomOnClick={false}
                  onClick={onClusterClick}>
                  {clusterer =>
                    spaces.map((item, index) => (
                      <Marker
                        key={index}
                        icon={getIcon(item)}
                        onClick={onClickSpace(item)}
                        position={{
                          lat: item['Common.Coordinate'].lat,
                          lng: item['Common.Coordinate'].lon,
                        }}
                        clusterer={clusterer}
                      />
                    ))
                  }
                </MarkerClusterer>
              </GoogleMap>
            </GMap>
          </ColMap>
        )}
      </Container>
    </>
  )
}

export default PropertyListings
