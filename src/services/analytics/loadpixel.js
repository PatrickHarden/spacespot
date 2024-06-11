/* eslint-disable no-undef */

export const loadPixelAPI = () => {
  const existingScript = document.getElementById('pixelapi')
  if (!existingScript) {
    const script = document.createElement('script')
    script.src = '//js.adsrvr.org/up_loader.1.1.0.js'
    script.type = 'text/javascript'
    script.id = 'pixelapi'
    document.body.appendChild(script)

    script.onload = () => {
      if (typeof TTDUniversalPixelApi === 'function') {
        const universalPixelApi = new TTDUniversalPixelApi()
        universalPixelApi.init(
          '6gmmyim',
          ['2ayrb1f'],
          'https://insight.adsrvr.org/track/up',
        )
      }
    }
  }
}
