interface Config {
  API_HOST: string
  GL_API_HOST: string
  GL_PHOTO_HOST: string
  B2C_CLIENT_ID: string
  B2C_FLOW_SIGNIN: string
  B2C_FLOW_SIGNUP: string
  B2C_HOST: string
  GOOGLE_TRACKING_CODE: string
  GOOGLE_MAPS_CLIENT: string
}

// IMPORTANT:
// All these values are public. Do not put secrets like API keys
// in front end code.

const dev: Config = {
  API_HOST: process.env.REACT_APP_API_HOST || '/api',
  GL_API_HOST: '/gl-api',
  GL_PHOTO_HOST: 'https://uat.commerciallistings.cbre.co.uk',
  B2C_CLIENT_ID: '83827eb8-24c8-4a24-9046-9f0a5c6c20cc',
  B2C_FLOW_SIGNIN: 'B2C_1_SS_Unified',
  B2C_FLOW_SIGNUP: 'B2C_1_singUp',
  B2C_HOST: 'https://uatspacespot.b2clogin.com/uatspacespot.onmicrosoft.com',
  GOOGLE_TRACKING_CODE: 'UA-152254742-1',
  GOOGLE_MAPS_CLIENT: 'gme-cbreltd',
}

const uat: Config = {
  API_HOST: process.env.REACT_APP_API_HOST || '/api',
  GL_API_HOST: '/gl-api',
  GL_PHOTO_HOST: 'https://uat.commerciallistings.cbre.co.uk',
  B2C_CLIENT_ID: '83827eb8-24c8-4a24-9046-9f0a5c6c20cc',
  B2C_FLOW_SIGNIN: 'B2C_1_SS_Unified',
  B2C_FLOW_SIGNUP: 'B2C_1_singUp',
  B2C_HOST: 'https://uatspacespot.b2clogin.com/uatspacespot.onmicrosoft.com',
  GOOGLE_TRACKING_CODE: 'UA-152254742-1',
  GOOGLE_MAPS_CLIENT: 'gme-cbreltd',
}

const prod: Config = {
  API_HOST: process.env.REACT_APP_API_HOST || '/api',
  GL_API_HOST: '/gl-api',
  GL_PHOTO_HOST: 'https://www.commerciallistings.cbre.co.uk',
  B2C_CLIENT_ID: 'abb668e7-72fd-4901-9124-487241d3a4f0',
  B2C_FLOW_SIGNIN: 'B2C_1_ss_unified',
  B2C_FLOW_SIGNUP: 'B2C_1_signup',
  B2C_HOST: 'https://spacespot.b2clogin.com/spacespot.onmicrosoft.com',
  GOOGLE_TRACKING_CODE: 'UA-97896300-8',
  GOOGLE_MAPS_CLIENT: 'gme-cbreltd',
}

const configs: { [key: string]: Config } = {
  prod: prod,
  test: uat,
  dev: dev,
  uat: uat,
}

// NOTE:
// The environment variable is evaluated at compile time, not runtime
const config = process.env.REACT_APP_ENV
  ? configs[process.env.REACT_APP_ENV]
    ? configs[process.env.REACT_APP_ENV]
    : dev
  : dev

export default {
  ...config,
  B2C_AUTHORITY: `${config.B2C_HOST}/${config.B2C_FLOW_SIGNIN}`,
  B2C_AUTHORITY_SIGNUP: `${config.B2C_HOST}/${config.B2C_FLOW_SIGNUP}`,
  GOOGLE_MAPS_LIBS: ['places'],
  CANONICAL_HOST: 'https://www.spacespot.no', // host for canonical links in prerender
  GOOGLE_MAPS_CHANNEL: document.domain,
  // Google Tag Manager id hardcoded in index.html
  // GOOGLE_GTM_ID: 'GTM-MG8RG5L',
}
