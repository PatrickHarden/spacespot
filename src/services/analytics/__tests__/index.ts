import Analytics from '../index'
import history from 'browserhistory'

jest.mock('react-ga')

describe('Analytics', () => {
  it('Init without consent', async () => {
    localStorage.removeItem('cookie-consent')
    Analytics.init()
  })
  it('Event without consent', async () => {
    Analytics.event({})
  })
  it('Init', async () => {
    localStorage.setItem('cookie-consent', 'true')
    Analytics.init()
  })
  it('Event', async () => {
    Analytics.event({})
  })
  it('Page views', async () => {
    history.push('/list')
  })
  it('Already loaded', async () => {
    Analytics.init()
  })
})
