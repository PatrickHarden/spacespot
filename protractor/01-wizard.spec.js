/* eslint-disable no-undef */
describe('Wizard', () => {
  it('Visit the app', async () => {
    await browser.get('http://localhost:3000/')
  })
  xit('Use wizard', async () => {
    const until = protractor.ExpectedConditions
    const wizard = element(by.css('[data-testid="Question-1"]'))
    browser.wait(until.presenceOf(wizard), 5000, 'No wizard in the DOM')
    await element(
      by.css('[data-testid="Question-1"] button[data-testid="Option-1"'),
    ).click()
    await element(
      by.css('[data-testid="Question-2"] button[data-testid="Option-1"'),
    ).click()
    await element(
      by.css('[data-testid="Question-3"] button[data-testid="Option-1"'),
    ).click()
    await element(
      by.css('[data-testid="Question-4"] button[data-testid="Option-1"'),
    ).click()
  })
})
