import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import { hydrate, render } from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { store } from './bootstrap/store'
import Analytics from 'services/analytics'

Analytics.init()

const rootElement = document.getElementById('root')

if (rootElement && rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement,
  )
} else {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement,
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
