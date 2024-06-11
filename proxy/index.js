/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const proxy = require('http-proxy-middleware')

const app = express()

app.use(
  '/api',
  proxy({
    // target: 'https://18.189.104.9',
    target: 'https://dev.spacespot.com',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
  }),
)
app.use(
  '/gl-api',
  proxy({
    // target: 'https://search.cbrelistings.com',
    target: 'https://uat-search.cbrelistings.com',
    changeOrigin: true,
    pathRewrite: { '^/gl-api': '/api' },
    logLevel: 'debug',
  }),
)
// const proxyUrl = `http://localhost:${process.env.PROXY_PORT || 3042}/`
const sitecoreURL = 'https://cbre-preprod-centralus-svc-cm.azurewebsites.net'
app.use(
  '/sitecore',
  proxy({
    target: sitecoreURL,
    changeOrigin: true,
    logLevel: 'debug',
  }),
)
app.use(proxy('/data/media', { target: sitecoreURL, logLevel: 'debug' }))
app.listen(8080)
