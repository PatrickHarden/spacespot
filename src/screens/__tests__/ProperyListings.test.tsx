import React from 'react'
import { Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import { createMockStore } from 'redux-test-utils'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'

import List from '../PropertyListings'
import data from '../__mocks__/list.json'
import { MarkerClusterer } from '@react-google-maps/api'
import { Cluster } from '@react-google-maps/marker-clusterer'

class MockMap {
  setCenter() {
    return
  }
  fitBounds() {
    return
  }
}

const mockMap = new MockMap()

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

jest.mock('@react-google-maps/api', () => {
  const GoogleMap = (props: {
    onLoad: (map: any) => void
    children: React.ReactNode
  }) => {
    props.onLoad(mockMap)
    return <div>{props.children}</div>
  }
  const Marker = () => <div />
  const Autocomplete = () => <div />
  const MarkerClusterer = (props: {
    onLoad: () => void
    onClick: () => void
    children: (clusterer: any) => React.ReactNode
  }) => {
    props.onLoad()
    return <div>{props.children(null)}</div>
  }
  const useLoadScript = () => {
    return { isLoaded: true }
  }
  return { GoogleMap, Marker, MarkerClusterer, Autocomplete, useLoadScript }
})

test('Shows the building details (enzyme)', async () => {
  class MockCluster {
    getBounds() {
      return
    }
  }
  const mockCluster = new MockCluster()
  const testState = {
    search: {
      search: data,
    },
  }
  const store: any = createMockStore(testState)
  const wrapper = mount(
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <List />
      </Router>
      ,
    </Provider>,
  )
  const list = wrapper.find(List)
  expect(mountToJson(list)).toMatchSnapshot()
  // FIXME tests to fix
  // wrapper.update()
  // const mc = wrapper.find(MarkerClusterer)
  // const onClick = mc.props().onClick
  // if (onClick) {
  //   onClick(mockCluster as Cluster)
  // }
})
