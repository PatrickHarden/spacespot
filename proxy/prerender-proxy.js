/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const proxy = require('http-proxy-middleware')
const serveStatic = require('serve-static')
const fallback = require('express-history-api-fallback')

const config = {
  prod: {
    gl: 'https://search.cbrelistings.com',
    api: 'https://www.spacespot.com',
  },
  uat: {
    gl: 'https://uat-search.cbrelistings.com',
    api: 'https://uat.spacespot.com',
  },
  test: {
    gl: 'https://uat-search.cbrelistings.com',
    api: 'https://test.spacespot.com',
  },
  dev: {
    gl: 'https://uat-search.cbrelistings.com',
    api: 'https://dev.spacespot.com',
  },
}

let env = 'dev'
switch (process.env.REACT_APP_ENV) {
  case 'prod':
  case 'uat':
  case 'test':
    env = process.env.REACT_APP_ENV
    break
  default:
    env = 'dev'
}

const root = 'build'
const app = express()

app.use(
  '/api',
  proxy({
    target: config[env].api,
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
  }),
)
app.use(
  '/gl-api',
  proxy({
    target: config[env].gl,
    changeOrigin: true,
    pathRewrite: { '^/gl-api': '/api' },
    logLevel: 'debug',
  }),
)
app.use('/', serveStatic(root))
app.use(fallback('200.html', { root: root }))
app.listen(8080)
