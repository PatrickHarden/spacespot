/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires

describe('Delete building', () => {
  const until = protractor.ExpectedConditions

  xit('should delete building', async () => {
    await browser.get('http://localhost:3000/')
    const dashboard = element(by.css('[data-testid="dashboard"]'))
    browser.wait(until.presenceOf(dashboard), 5000, 'No dashboard link')
    await dashboard.click()
    const xbutton = element.all(by.css('[data-testid="delete-building"]'))
    browser.wait(until.presenceOf(xbutton), 5000, 'No delete button')
    browser.wait(
      until.elementToBeClickable(xbutton.first()),
      1000,
      'no del button',
    )
    await xbutton.first().click()
    const cancel = element(by.id('dialogCancel'))
    browser.wait(until.presenceOf(cancel), 3000, 'No cancel popup')
    await cancel.click()

    browser.wait(
      until.elementToBeClickable(xbutton.first()),
      1000,
      'no del button',
    )
    await xbutton.first().click()

    const del = element(by.id('dialogDelete'))
    browser.wait(until.presenceOf(del), 3000, 'No delete popup')
    await del.click()
    await browser.sleep(10000)
  })
})
