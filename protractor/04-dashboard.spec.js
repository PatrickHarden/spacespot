/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

describe('Dashboard', () => {
  const now = new Date().toISOString()
  const until = protractor.ExpectedConditions

  it('should go to dashboard', async () => {
    await browser.get('http://localhost:3000/')
    const dashboard = element(by.css('[data-testid="dashboard"]'))
    browser.wait(until.presenceOf(dashboard), 5000, 'No dashboard link')
    await dashboard.click()
  })

  it('should create new building', async () => {
    const addSpace = element(by.css('[data-testid="add-space"]'))
    browser.wait(until.presenceOf(addSpace), 5000, 'No add space button')
    addSpace.click()
    const newBuilding = element(by.css('[data-testid="new-building"]'))
    browser.wait(until.presenceOf(newBuilding), 5000, 'No new button')
    newBuilding.click()
    await element(by.id('name')).sendKeys('Bryggegata 29 test')
    await element(by.id('address')).sendKeys('Bryggegata 29, 0250 Oslo, Norway')
    const item = element(by.css('.pac-item'))
    browser.wait(until.presenceOf(item), 5000, 'No gmap item')
    await item.click()
    await element(by.id('description')).sendKeys('Test Oslo Norway')
    await element(by.id('location')).sendKeys('Oslo, Norway')
    await element(by.id('postCode')).sendKeys('0250')
    await element
      .all(by.css('input[type="checkbox"] + span'))
      .first()
      .click()
    const drop = element.all(by.css('input[type="file"]'))
    await drop.first().sendKeys(path.resolve(__dirname, 'assets/photo1.jpg'))
    await drop.last().sendKeys(path.resolve(__dirname, 'assets/doc1.pdf'))
    await element(by.id('button-next')).click()
  })

  it('should create space', async () => {
    const flex = element(by.css('[data-testid="add-flex"]'))
    browser.wait(until.presenceOf(flex), 5000, 'No flex choice')
    await flex.click()
    await element(by.id('spaceName')).sendKeys('Bryggegata 29 1 ' + now)
    await element(by.id('spaceDescription')).sendKeys('Bryggegata 29 1 ' + now)
    await element(by.id('spaceHighlights')).sendKeys('Bryggegata 29 1 ' + now)
    await element(by.id('hot-desks-desks')).sendKeys('50')
    await element(by.id('hot-desks-minLease')).sendKeys('1')
    await element(by.id('hot-desks-price')).sendKeys('5000')
    await element(by.id('fixed-desks-desks')).sendKeys('50')
    await element(by.id('fixed-desks-minLease')).sendKeys('5')
    await element(by.id('fixed-desks-price')).sendKeys('5000')
    const drop = element.all(by.css('input[type="file"]'))
    await drop.first().sendKeys(path.resolve(__dirname, 'assets/photo1.jpg'))
    await drop.last().sendKeys(path.resolve(__dirname, 'assets/fplan1.jpg'))
    await element(by.id('button-next')).click()
  })

  it('should create second space', async () => {
    const addOther = element(by.css('[data-testid="add-another"]'))
    browser.wait(until.presenceOf(addOther), 5000, 'No add another button')
    addOther.click()
    const flex = element(by.css('[data-testid="add-flex"]'))
    browser.wait(until.presenceOf(flex), 5000, 'No flex choice')
    await flex.click()
    await element(by.id('spaceName')).sendKeys('Bryggegata 29 2 ' + now)
    await element(by.id('spaceDescription')).sendKeys('Bryggegata 29 2 ' + now)
    await element(by.id('spaceHighlights')).sendKeys('Bryggegata 29 2 ' + now)
    await element(by.id('hot-desks-desks')).sendKeys('50')
    await element(by.id('hot-desks-minLease')).sendKeys('1')
    await element(by.id('hot-desks-price')).sendKeys('5000')
    await element(by.id('fixed-desks-desks')).sendKeys('50')
    await element(by.id('fixed-desks-minLease')).sendKeys('5')
    await element(by.id('fixed-desks-price')).sendKeys('5000')
    drop = element.all(by.css('input[type="file"]'))
    await drop.first().sendKeys(path.resolve(__dirname, 'assets/photo1.jpg'))
    await drop.last().sendKeys(path.resolve(__dirname, 'assets/fplan1.jpg'))
    await element(by.id('button-next')).click()
  })

  it('should duplicate, delete, edit', async () => {
    await element
      .all(by.css('[data-testid="dup"]'))
      .first()
      .click()
    await element
      .all(by.css('[data-testid="delete"]'))
      .first()
      .click()
    await element
      .all(by.css('[data-testid="space-name"]'))
      .first()
      .click()
    await element(by.id('button-next')).click()
  })

  /* Skip this for now to avoid publishing and polluting the DB */
  xit('should publish', async () => {
    await element(by.id('button-next')).click()
    const cont = element(by.css('[data-testid="publish-ok"]'))
    browser.wait(until.presenceOf(cont), 30000, 'No publish ok button')
    await cont.click()
  })
})
