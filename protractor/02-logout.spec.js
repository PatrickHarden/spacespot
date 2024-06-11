/* eslint-disable no-undef */
describe('Logout', () => {
  it('should do logout', async () => {
    await element(by.css('[data-testid="logout"]')).click()
    const signin = element(by.css('[data-testid="signin"]'))
    const until = protractor.ExpectedConditions
    browser.wait(until.presenceOf(signin), 5000, 'No signin in the DOM')
  })
})
