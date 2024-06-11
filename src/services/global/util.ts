export function dataURItoBlob(dataURI: any) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1])

  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)

  // create a view into the buffer
  const ia = new Uint8Array(ab)

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], { type: mimeString })
}

export const getCurrencyDesc = (code: string) => {
  const currencyCodes: { [index: string]: [string, string] } = {
    GBP: ['￡', ''],
    EUR: ['', '€'],
    USD: ['$', ''],
    NOK: ['', 'kr'],
    JPY: ['¥', ''],
  }
  return currencyCodes[code] || ['', code]
}

export function formatCurrency(x: number, currencyCode: string) {
  /* ES6 way:
   * const formatOptions: Intl.NumberFormatOptions = { .... }
   * const fmt = new Intl.NumberFormat(navigator.language, formatOptions)
   * return fmt.format(monthlyRent).
   *
   * Intl way:
   * const formatOptions: FormatNumberOptions = {
   *   style: 'currency',
   *   currency: currencyCode,
   *   currencyDisplay: 'symbol',
   *   minimumFractionDigits: 0,
   *   maximumFractionDigits: 0,
   * }
   * return intl.formatNumber(x, formatOptions)
   *
   * Custom way:
   */
  const fmted = x !== undefined && x !== null ? x.toLocaleString() : ''
  const [leftSym, rightSym] = getCurrencyDesc(currencyCode)
  return `${leftSym}${fmted}${rightSym}`
}

export const formatPrice = (
  x: number,
  currencyCode: string,
  contactUs: string,
) => (x < 99 ? contactUs : formatCurrency(x, currencyCode))

/**
 * Check for invalid URL
 * @param {String} url
 * @returns true if error
 */
export function invalidURL(url: string) {
  const regex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi,
  )
  return url ? !url.match(regex) : false
}

/**
 * Check for invalid email
 * @param {String} email
 * @returns true if error
 */
export function invalidEmail(mail: string) {
  const regex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
  return mail ? !regex.test(mail) : true
}

/**
 * Check for invalid password
 * @param {String} password
 * @returns true if error
 * Current Rules:
 * The password must be between 8 and 64 characters.
   The password must have at least 3 of the following:
   - a lowercase letter
   - an uppercase letter
   - a digit
   - a symbol
 */
export function invalidPassword(password: string) {
  // first gate : password can't be undefined and has to have a length between 8 and 64
  if (password && new RegExp(/^.{8,64}$/).test(password)) {
    let conditionsMet = 0
    // test out lower case
    new RegExp(/^(?=.*[a-z])/).test(password) && conditionsMet++
    // test out upper case
    new RegExp(/^(?=.*[A-Z])/).test(password) && conditionsMet++
    // test out digit
    new RegExp(/^(?=.*[0-9])/).test(password) && conditionsMet++
    // test out symbol
    new RegExp(/^(?=.*[!@#$%^&*])/).test(password) && conditionsMet++
    // if at least three conditions are met, return true
    if (conditionsMet >= 3) {
      return false
    }
  }
  return true // invalid in all other scenarios
}

/**
 * Check for invalid date
 * @param {String} value
 * @returns true if error
 */
export const invalidDate = (value: string) => {
  return !value || isNaN(new Date(value).valueOf())
}

/**
 * Check for invalid string
 *
 * String is invalid if undefined, null or empty
 *
 * @param {String} value
 * @returns true if error
 */
export const invalidString = (value: string) =>
  value === undefined || value === null || value === ''

/**
 * Check for invalid integer number
 *
 * @param {String} value
 * @param {Number} min
 * @param {Number} max
 * @returns true if error
 */
export const invalidNumber = (value: string, min?: number, max?: number) => {
  if (!value) return true
  const val = Number(value)
  return (
    value !== val.toFixed() ||
    (min !== undefined && val < min) ||
    (max !== undefined && val > max)
  )
}

/**
 * Returns the zoom level at which the given rectangular region fits in the map view.
 * The zoom level is computed for the currently selected map type.
 * @param {google.maps.Map} map
 * @param {google.maps.LatLngBounds} bounds
 * @param {Number} padding
 * @return {Number} zoom level
 **/
export function getZoomByBounds(
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  padding: number,
) {
  const MAX_ZOOM = map.mapTypes.get(map.getMapTypeId()).maxZoom || 21
  const MIN_ZOOM = map.mapTypes.get(map.getMapTypeId()).minZoom || 0
  const prj = map.getProjection()
  if (!prj) return 0
  const ne = prj.fromLatLngToPoint(bounds.getNorthEast())
  const sw = prj.fromLatLngToPoint(bounds.getSouthWest())
  const worldCoordWidth = Math.abs(ne.x - sw.x)
  const worldCoordHeight = Math.abs(ne.y - sw.y)
  // Fit padding in pixels
  const div = map.getDiv()
  for (let zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom) {
    if (
      worldCoordWidth * (1 << zoom) + 2 * padding < div.clientWidth &&
      worldCoordHeight * (1 << zoom) + 2 * padding < div.clientHeight
    )
      return zoom
  }
  return 0
}

export const getFileType = (fileName: string) => {
  const ext = fileName
    ? fileName.toLowerCase().substr(fileName.lastIndexOf('.') + 1)
    : ''
  let type = `image/${ext}`
  if (ext === 'doc' || ext === 'docx') {
    type = 'application/msword'
  } else if (ext === 'pdf' || ext === 'bim') {
    type = `application/${ext}`
  }
  return type
}

export const getOrigin = () => {
  return window.location.origin
    ? window.location.origin
    : window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '')
}
