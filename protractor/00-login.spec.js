/* eslint-disable no-undef */
describe('Login as Tenant', () => {
  // beforeAll(async () => {})
  // beforeEach(async () => {})

  it('should do signin', async () => {
    const until = protractor.ExpectedConditions
    await browser.get('http://localhost:3000/')
    await element(by.css('[data-testid="signin"]')).click()
    const logon = element(by.id('logonIdentifier'))
    browser.wait(until.presenceOf(logon), 5000, 'No logonIdentifier in the DOM')
    await element(by.id('logonIdentifier')).sendKeys('Manuel.taran@yahoo.com')
    await element(by.id('password')).sendKeys('CBREManu10')
    await element(by.id('next')).click()
    const logout = element(by.css('[data-testid="logout"]'))
    browser.wait(until.presenceOf(logout), 5000, 'No logout in the DOM')
  })
})
