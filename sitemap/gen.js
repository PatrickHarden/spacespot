/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const env = process.env.REACT_APP_ENV === 'prod' ? 'prod' : 'uat'

const config = {
  prod: {
    gl: 'https://search.cbrelistings.com',
    ss: 'https://www.spacespot.no',
    detailLimit: 200,
  },
  uat: {
    gl: 'https://uat-search.cbrelistings.com',
    ss: 'https://uat.spacespot.no',
    detailLimit: 10,
  },
}
const host = config[env].ss
const gl = config[env].gl
const detailLimit = config[env].detailLimit
const url = `${gl}/api/propertylistings/query?Site=all-spacespot&PageSize=180&Page=1&Common.IsParent=false`
const today = new Date().toISOString().slice(0, 10)

const getPostalAddress = space => {
  const actual = _.get(space, 'Common.ActualAddress')
  const postal = _.get(actual, 'Common.PostalAddresses', [])
  return postal[0]
}

const getStreet = space => {
  const address = getPostalAddress(space)
  return _.get(address, 'Common.Line2', _.get(address, 'Common.Line1', ''))
}

const getDistrict = space => {
  const address = getPostalAddress(space)
  return _.get(address, 'Common.Line3', '')
}

const getSubdistrict = space => {
  const address = getPostalAddress(space)
  return {
    id: 0,
    name: _.get(address, 'Common.Line4', ''),
  }
}

const getCity = space => {
  const address = getPostalAddress(space)
  return _.get(address, 'Common.Locallity', '')
}

const getTitle = space =>
  _.get(
    space,
    '["Common.Strapline"][0]["Common.Text"]',
    _.get(getPostalAddress(space), 'Common.Line1', ''),
  )

const getPK = space => _.get(space, 'Common.PrimaryKey', '')

const isFixed = space => _.get(space, 'Common.UsageType') === 'Office'

const getSpaceURI = (space, lang) => {
  const office = lang === 'nb' ? 'kontor' : 'office'
  const coworking = 'coworking'
  const id = getPK(space)
  const address = getStreet(space).replace(/\//g, '-')
  const district = (getDistrict(space) || 'NA').replace(/\//g, '-')
  const subdistrict = (getSubdistrict(space).name || 'NA').replace(/\//g, '-')
  const city = getCity(space)
  const title = getTitle(space).replace(/\//g, '-')
  const stype = isFixed(space) ? office : coworking
  const uri = `detail/${stype}/${city}/${district}/${subdistrict}/${id}/${title}-${address}`
  const repKeys = {
    æ: 'ae',
    å: 'aa',
    ø: 'oe',
    Æ: 'Ae',
    Å: 'Aa',
    Ø: 'Oe',
    á: 'a',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    Á: 'A',
    É: 'E',
    Í: 'I',
    Ó: 'O',
    Ú: 'U',
    '–': '-',
    '|': '-',
    ä: 'a',
    ë: 'e',
    ï: 'i',
    ö: 'o',
    ü: 'u',
    Ä: 'A',
    Ë: 'E',
    Ï: 'I',
    Ö: 'O',
    Ü: 'U',
  }
  return uri
    .replace(/['()&?,. ]/g, '-')
    .replace(/\*/g, '-')
    .replace(/[æåøÆÅØáéíóúÁÉÍÓÚ–|äëïöüÄËÏÖÜ]/g, char => repKeys[char] || '')
    .replace(/-+/g, '-')
}

const robots = () => {
  const stream1 = fs.createWriteStream('public/robots-com.txt')
  stream1.once('open', () => {
    stream1.write('# https://www.robotstxt.org/robotstxt.html\n')
    stream1.write('User-agent: *\n')
    stream1.write(`Sitemap: ${host}/sitemap.xml\n`)
    stream1.write('Disallow: /\n')
    stream1.write('\n')
  })
  const stream2 = fs.createWriteStream('public/robots-no.txt')
  stream2.once('open', () => {
    stream2.write('# https://www.robotstxt.org/robotstxt.html\n')
    stream2.write('User-agent: *\n')
    stream2.write(`Sitemap: ${host}/sitemap.xml\n`)
    stream2.write('\n')
  })
}

const sitemap = async () => {
  const res = await axios.get(url)
  const docs = res.data.Documents[0]
  // remove spaces without parent building
  const booleans = await Promise.all(
    docs.map(i => {
      const parent = i['Common.ParentProperty']
      const uri = `${gl}/api/propertylisting/${parent}?Site=all-spacespot`
      return new Promise(res => {
        axios
          .get(uri)
          .then(() => {
            res(true)
          })
          .catch(() => {
            res(false)
          })
      })
    }),
  )
  const spaces = docs.filter((x, i) => booleans[i])

  const stream = fs.createWriteStream('public/sitemap.xml')
  const put = s => {
    stream.write(s)
    stream.write('\n')
  }
  stream.once('open', () => {
    put('<?xml version="1.0" encoding="UTF-8"?>')
    put('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    // Static paths to add to the sitemap
    const entries = [
      'en/',
      'nb-no/',
      'fi-fi/',
      'de-de/',
      'es-es/',
      'nb-no/list',
      'fi-fi/list',
      'de-de/list',
      'es-es/list',
      'nb-no/list?location=Oslo',
      'fi-fi/list?location=Finland',
      'de-de/list?location=Germany',
      'es-es/list?location=Spain',
    ]
    entries.forEach(i => {
      put(' <url>')
      put(`  <loc>${host}/${i}</loc>`)
      put(`  <lastmod>${today}</lastmod>`)
      put(`  <priority>0.5</priority>`)
      put(' </url>')
    })

    // Add spaces
    spaces.forEach(i => {
      const uriEN = getSpaceURI(i, 'en')
      const uriNB = getSpaceURI(i, 'nb')
      const uriFI = getSpaceURI(i, 'fi')
      const updated = i['Common.SourceLastupdated']
      const lastmod = updated
        ? new Date(updated).toISOString().slice(0, 10)
        : today
      const url1 = encodeURI(`${host}/nb-no/${uriNB}`)
      const url2 = encodeURI(`${host}/en/${uriEN}`)
      const url3 = encodeURI(`${host}/fi-fi/${uriFI}`)
      const url4 = encodeURI(`${host}/de-de/${uriFI}`)
      const url5 = encodeURI(`${host}/es-es/${uriFI}`)
      put(' <url>')
      put(`  <loc>${url1}</loc>`)
      put(`  <lastmod>${lastmod}</lastmod>`)
      put(`  <priority>0.5</priority>`)
      put(' </url>')
      put(' <url>')
      put(`  <loc>${url2}</loc>`)
      put(`  <lastmod>${lastmod}</lastmod>`)
      put(`  <priority>0.5</priority>`)
      put(' </url>')
      put(' <url>')
      put(`  <loc>${url3}</loc>`)
      put(`  <lastmod>${lastmod}</lastmod>`)
      put(`  <priority>0.5</priority>`)
      put(' </url>')
      put(' <url>')
      put(`  <loc>${url4}</loc>`)
      put(`  <lastmod>${lastmod}</lastmod>`)
      put(`  <priority>0.5</priority>`)
      put(' </url>')
      put(' <url>')
      put(`  <loc>${url5}</loc>`)
      put(`  <lastmod>${lastmod}</lastmod>`)
      put(`  <priority>0.5</priority>`)
      put(' </url>')
    })
    put('</urlset>')
  })

  // prerender links (limit detailLimmit)
  const links = fs.createWriteStream('public/links.html')
  links.once('open', () => {
    spaces.slice(0, detailLimit).forEach(i => {
      const key = i['Common.PrimaryKey']
      const uri1 = encodeURI(getSpaceURI(i, 'nb'))
      const uri2 = encodeURI(getSpaceURI(i, 'en'))
      const uri3 = encodeURI(getSpaceURI(i, 'fi'))
      const uri4 = encodeURI(getSpaceURI(i, 'de'))
      const uri5 = encodeURI(getSpaceURI(i, 'es'))
      links.write(`<a href="/nb-no/${uri1}">${key} nb</a>\n`)
      links.write(`<a href="/en/${uri2}">${key} en</a>\n`)
      links.write(`<a href="/fi-fi/${uri3}">${key} en</a>\n`)
      links.write(`<a href="/de-de/${uri4}">${key} en</a>\n`)
      links.write(`<a href="/es-es/${uri5}">${key} en</a>\n`)
    })
  })
}

robots()
sitemap()
